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
        classes: ['ui-panel', 'app'],
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

    #time = { minutes: 0, hours: 0, days: 0 }
    refresh = foundry.utils.debounce(this.render, 100)

    init () {
        Hooks.on(Timekeeper.TIME_CHANGE_HOOK, this.timeChangeHandler.bind(this))
        game.socket.on(`module.${MODULE_ID}`, time => {
            this.#time = time
            this.render(true)
        })
        if (!UIPanel.DEFAULT_OPTIONS.window.frame) this.#insertAppElement('#players')

        UIPanel.registerKeybindings()
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
         * Shame it doesn't appear to work with ApplicationV2, since it put the UI exactly where I wanted it
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

    /**
     * Simple remapping of the shifts.
     * Technically night shift is 12am to 6am and is the first shift of the day,
     * but I think it looks better if displayed as the last shift of the day.
     * This lookup table rotates the shift indicies for the radial clock.
     */
    static #shiftDisplay = {
        0: 4, // night, 12am to 6am
        1: 1, // morning, 6am to 12pm
        2: 2, // afternoon, 12pm to 6pm
        3: 3, // evening, 6pm to 12am
    }

    #prepareClocks (time) {
        // prep the time data
        const clocks = [
            {
                id: 'etk-stretches',
                value: time.stretches + 1,
                max: Constants.stretchesPerShift,
                name: 'Stretch',
                color: UIPanel.#clockColor,
                backgroundColor: '#ffffff',
            },
            {
                id: 'etk-shifts',
                value: UIPanel.#shiftDisplay[time.shifts],
                max: Constants.shiftsPerDay,
                name: time.shiftName,
                color: UIPanel.#clockColor,
                backgroundColor: '#ffffff',
            },
            // {
            //     id: 'etk-days',
            //     value: time.days + 1,
            //     max: 128,
            //     name: 'Day',
            //     color: UIPanel.#clockColor,
            //     backgroundColor: '#ffffff',
            // },
            // {
            //     id: 'etk-totalStretches',
            //     value: time.totalStretches % Constants.stretchesPerDay,
            //     max: Constants.stretchesPerDay,
            //     name: 'Stretches',
            //     color: UIPanel.#clockColor,
            //     backgroundColor: '#ffffff',
            // },
        ]
        // derive the radial data
        const maxSpokes = 28
        return clocks.map(data => ({
            ...data,
            value: Math.clamp(data.value, 0, data.max),
            spokes: data.max > maxSpokes ? [] : Array(data.max).keys(),
        }))
    }

    _prepareContext (options) {
        const context = {
            isGM: game.user.isGM,
            textColor: UIPanel.#uiTextColor,
        }

        if (UIPanel.#playerSeesNothing) {
            context.time = game.i18n.localize('JDTIMEKEEPING.YouHaveNoIdeaOfTheTime')
        } else {
            if (Helpers.showTimeOfDay) {
                context.time = Helpers.toTimeString(this.#time, {
                    includeDay: true,
                    i18nFormatter: 'JDTIMEKEEPING.uiTimeOfDay',
                })
            }

            // some calculations are common whether we are showing either one or both of these
            if (UIPanel.#showDBTime || UIPanel.#showRadialClocks) {
                const dbtime = Helpers.factorDragonbaneTime(this.#time)
                dbtime.shiftName = Helpers.getDragonbaneShiftName(dbtime.shifts)
                dbtime.textColor = context.textColor  // it's the same color for now, but could be different

                if (UIPanel.#showDBTime) {
                    // new approach: just pass in a data object and handle layout in the template
                    if (Helpers.showTimeOfDay) dbtime.days = null // hide days if they are already shown in time string
                    context.dbtime = dbtime
                }

                if (UIPanel.#showRadialClocks) context.clocks = this.#prepareClocks(dbtime)
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
            // TODO: keyboard modifiers

            if (dataTarget === 'small-increment') {
                tk.increment({ minutes: UIPanel.#smallTimeDelta })
            } else if (dataTarget === 'large-increment') {
                tk.increment({ hours: UIPanel.#largeTimeDelta })
            } else if (dataTarget === 'large-decrement') {
                tk.increment({ hours: -UIPanel.#largeTimeDelta })
            } else if (dataTarget === 'small-decrement') {
                tk.increment({ minutes: -UIPanel.#smallTimeDelta })
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

    static get #clockColor () {
        return game.settings.get(MODULE_ID, SETTINGS.RADIAL_CLOCK_COLOR)
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
        return !UIPanel.#showDBTime && !Helpers.showTimeOfDay && !UIPanel.#showRadialClocks
    }

    static get #showDBTime () {
        return game.settings.get(MODULE_ID, SETTINGS.SHOW_DRAGONBANE_TIME)
    }

    static get #showRadialClocks () {
        return game.settings.get(MODULE_ID, SETTINGS.SHOW_RADIAL_CLOCK)
    }
}
