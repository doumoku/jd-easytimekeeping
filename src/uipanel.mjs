/**
 * The UI panel.
 */
import { Timekeeper } from './timekeeper.mjs'
import { MODULE_ID, SETTINGS } from './settings.mjs'
import { Helpers } from './helpers.mjs'
import { SetTimeApplication } from './settimeapp.mjs'
import { Constants } from './constants.mjs'
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class UIPanel extends HandlebarsApplicationMixin(ApplicationV2) {
    static ID = 'jd-et-uipanel'
    static DEFAULT_OPTIONS = {
        tag: 'div',
        classes: ['ui-panel', 'app', 'fade-element', 'receive-pointer-events'],
        id: UIPanel.ID,
        window: {
            frame: false,
        },
        actions: {
            'time-delta': UIPanel.timeDeltaButtonHandler,
            'set-time': UIPanel.setTimeButtonHandler,
            'reset-time': UIPanel.resetTimeButtonHandler,
        },
    }

    static PARTS = {
        form: {
            template: `modules/${MODULE_ID}/templates/uipanel.hbs`,
        },
    }

    #avDockWhenSettingsOpen = null
    #time = null
    refresh = foundry.utils.debounce(this.render, 100)

    ready () {
        Hooks.on(Timekeeper.TIME_CHANGE_HOOK, this.timeChangeHandler.bind(this))
        Hooks.on('renderAVConfig', this.renderAVConfigHandler.bind(this))
        Hooks.on('closeAVConfig', this.closeAVConfigHandler.bind(this))
        game.socket.on(`module.${MODULE_ID}`, time => {
            this.#time = time
            this.render(true)
        })
        if (!UIPanel.DEFAULT_OPTIONS.window.frame) this.#insertAppElement('#players')
    }

    static registerKeybindings () {
        // Set time
        game.keybindings.register(MODULE_ID, 'set-time', {
            name: 'JDTIMEKEEPING.SetTime.hotkey',
            precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY,
            restricted: true,
            onDown: async () => {
                await UIPanel.setTimeButtonHandler()
                return true
            },
        })

        // Reset time
        game.keybindings.register(MODULE_ID, 'reset-time', {
            name: 'JDTIMEKEEPING.ResetTime.hotkey',
            precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY,
            restricted: true,
            onDown: async () => {
                await UIPanel.resetTimeButtonHandler()
                return true
            },
        })
    }

    #insertAppElement (target) {
        /**
         * This creates a DOM element in the ui-left interface div,
         * in between the canvas controls and the players panel.
         * Technique from Global Progress Clocks.
         * */
        const top = document.querySelector(target)
        if (top) {
            const template = document.createElement('template')
            template.setAttribute('id', UIPanel.ID)
            top.insertAdjacentElement('beforebegin', template)
        } else {
            console.error('JD ETime | Could not initialise UI Panel')
        }
    }

    timeChangeHandler (data) {
        this.#time = data.time
        game.socket.emit(`module.${MODULE_ID}`, this.#time)
        this.render(true)
    }

    renderAVConfigHandler () {
        this.#avDockWhenSettingsOpen = game.webrtc.settings.client.dockPosition
    }

    closeAVConfigHandler () {
        /**
         * if the AV dock position has changed, we need to force a Foundry reload
         * since Foundry is currently inconsistent in when this occurs.
         */
        const after = game.webrtc.settings.client.dockPosition
        if (this.#avDockWhenSettingsOpen != after) SettingsConfig.reloadConfirm({ world: true })
    }

    #prepareClocks (time) {
        // prep the time data
        const clocks = [
            {
                id: 'etk-turns',
                value: time.turns + 1,
                max: Constants.stretchesPerShift,
                name: game.i18n.format('JDTIMEKEEPING.gameTurnFormat', {
                    gameTurnName: UIPanel.#gameTurnName,
                    gameTurnNumber: (time.turns + 1).toString(),
                }),
                color: UIPanel.#clockFGColor,
                backgroundColor: UIPanel.#clockBGColor,
            },
            {
                id: 'etk-shifts',
                value: time.shifts + 1,
                max: Constants.shiftsPerDay,
                name: time.shiftName,
                color: UIPanel.#clockFGColor,
                backgroundColor: UIPanel.#clockBGColor,
            },
            {
                /**
                 * note that we need to display everything in
                 * 1-based values, but all the calculations
                 * are 0-based. Thus we have +1 all over the place.
                 */
                id: 'etk-days',
                value: time.day.index,
                max: 7,
                name: game.i18n.format('JDTIMEKEEPING.Time.DayAndWeek', {
                    day: time.day.name,
                    weekName: Helpers.weekName,
                    week: time.weekNumber,
                }),
                color: UIPanel.#clockFGColor,
                backgroundColor: UIPanel.#clockBGColor,
            },
        ]
        // derive the radial data
        // const maxSpokes = 36
        const maxSpokes = 28
        return clocks.map(data => ({
            ...data,
            value: Math.clamp(data.value, 0, data.max),
            spokes: data.max > maxSpokes ? [] : Array(data.max).keys(),
        }))
    }

    _onRender (context, options) {
        /**
         * Need to find and replace the opacity variable to pass the
         * client setting into the CSS for the UI fade feature.
         * On the first render, the top-level element has no style
         * attribute yet, so we need to handle that case as well.
         */
        const regex = /--opacity:\d+.?\d*;/g
        let style = this.element.getAttribute('style')
        if (style) {
            style = style.replaceAll(regex, '')
            this.element.setAttribute('style', style + `--opacity:${UIPanel.#uiFadeOpacity};`)
        } else {
            this.element.setAttribute('style', `--opacity:${UIPanel.#uiFadeOpacity};`)
        }
    }

    _prepareContext (options) {
        if (this.#time === null) {
            this.#time = game.modules.get(MODULE_ID)?.api?.getTime() || {
                totalMinutes: 0,
                minutes: 0,
                hours: 0,
                days: 0,
                weekNumber: 1,
                day: { index: 1, name: 'Monday' },
            }
        }

        const context = {
            isGM: game.user.isGM,
            textColor: UIPanel.#uiTextColor,
            btn: {
                color: UIPanel.#timeStepButtonColor,
                hoverColor: UIPanel.#timeStepButtonHoveredColor,
                clickColor: UIPanel.#timeStepButtonClickedColor,
            },
        }

        if (UIPanel.#playerSeesNothing) {
            context.time = game.i18n.localize('JDTIMEKEEPING.YouHaveNoIdeaOfTheTime')
        } else {
            if (Helpers.showExactTime) {
                context.time = Helpers.toTimeString(this.#time, UIPanel.#showLongFormatTime)
            }

            // some calculations are common whether we are showing either one or both of these
            if (UIPanel.#showDBTime || UIPanel.#showRadialClocks) {
                const gameTurnData = Helpers.factorGameTurns(this.#time.totalMinutes)
                gameTurnData.textColor = context.textColor // it's the same color for now, but could be different

                if (UIPanel.#showDBTime) {
                    // just pass in a data object and handle layout in the template
                    // make adjustments to the copy, since the original is used for the graphical display
                    context.gameTurnData = foundry.utils.deepClone(gameTurnData)
                    // display as 1-based
                    context.gameTurnData.gameTurnName = UIPanel.#gameTurnName
                    context.gameTurnData.days += 1
                    context.gameTurnData.shifts += 1
                    context.gameTurnData.turns += 1
                    if (Helpers.showExactTime) context.gameTurnData.days = null // hide days if they are already shown in time string
                }

                if (UIPanel.#showRadialClocks) context.clocks = this.#prepareClocks(gameTurnData)
            }
        }

        return context
    }

    /** Action Handlers */

    /**
     * @param {PointerEvent} event - The originating click event
     * @param {HTMLElement} target - the capturing HTML element which defined a [data-action]
     */
    static timeDeltaButtonHandler (event, target) {
        const dataTarget = target.getAttribute('data-target')
        if (dataTarget) {
            const tk = game.modules.get(MODULE_ID).api
            let scale = 1
            if (event.ctrlKey) scale = 0.5
            else if (event.shiftKey) scale = 2

            if (dataTarget === 'small-increment') {
                tk.increment({ minutes: UIPanel.#smallTimeDelta * scale })
            } else if (dataTarget === 'large-increment') {
                tk.increment({ hours: UIPanel.#largeTimeDelta * scale })
            } else if (dataTarget === 'large-decrement') {
                tk.increment({ hours: UIPanel.#largeTimeDelta * -scale })
            } else if (dataTarget === 'small-decrement') {
                tk.increment({ minutes: UIPanel.#smallTimeDelta * -scale })
            }
        }
    }

    static async setTimeButtonHandler (event, target) {
        new SetTimeApplication().render(true)
    }

    static async resetTimeButtonHandler (event, target) {
        const reset = await foundry.applications.api.DialogV2.confirm({
            window: {
                icon: 'fa-solid fa-clock-rotate-left',
                title: 'JDTIMEKEEPING.ResetTime.title',
            },
            content: game.i18n.localize('JDTIMEKEEPING.ResetTime.content'),
            modal: true,
            rejectClose: false,
        })
        if (reset) {
            await game.modules.get(MODULE_ID).api.set({ days: 0, hours: 0, minutes: 0 })
        }
    }

    static get #uiTextColor () {
        return game.settings.get(MODULE_ID, SETTINGS.UI_TEXT_COLOR)
    }

    static get #clockFGColor () {
        return game.settings.get(MODULE_ID, SETTINGS.RADIAL_CLOCK_FG_COLOR)
    }

    static get #clockBGColor () {
        return game.settings.get(MODULE_ID, SETTINGS.RADIAL_CLOCK_BG_COLOR)
    }

    static get #timeStepButtonColor () {
        return game.settings.get(MODULE_ID, SETTINGS.UI_BUTTON_COLOR)
    }

    static get #timeStepButtonHoveredColor () {
        return game.settings.get(MODULE_ID, SETTINGS.UI_BUTTON_HOVERED_COLOR)
    }

    static get #timeStepButtonClickedColor () {
        return game.settings.get(MODULE_ID, SETTINGS.UI_BUTTON_CLICKED_COLOR)
    }

    static get #smallTimeDelta () {
        return game.settings.get(MODULE_ID, SETTINGS.SMALL_TIME_DELTA)
    }

    static get #largeTimeDelta () {
        return game.settings.get(MODULE_ID, SETTINGS.LARGE_TIME_DELTA)
    }

    /**
     * Has the GM chosen to hide all UI elements from players?
     */
    static get #playerSeesNothing () {
        return !UIPanel.#showDBTime && !Helpers.showExactTime && !UIPanel.#showRadialClocks
    }

    static get #showDBTime () {
        return game.settings.get(MODULE_ID, SETTINGS.SHOW_DRAGONBANE_TIME)
    }

    static get #showRadialClocks () {
        return game.settings.get(MODULE_ID, SETTINGS.SHOW_RADIAL_CLOCK)
    }

    static get #uiFadeOpacity () {
        return game.settings.get(MODULE_ID, SETTINGS.UI_FADE_OPACITY)
    }

    static get #showLongFormatTime () {
        return game.settings.get(MODULE_ID, SETTINGS.SHOW_LONG_FORMAT_TIME)
    }

    static get #gameTurnName () {
        return game.settings.get(MODULE_ID, SETTINGS.GAME_TURN_NAME)
    }
}
