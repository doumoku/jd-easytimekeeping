/**
 * The UI panel.
 */
import { Timekeeper } from './timekeeper.mjs'
import { MODULE_ID, SETTINGS } from './settings.mjs'
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class UIPanel extends HandlebarsApplicationMixin(ApplicationV2) {
    static ID = 'jd-et-uipanel'
    static DEFAULT_OPTIONS = {
        tag: 'div',
        classes: ['ui-panel', 'app', ''],
        id: UIPanel.ID,
        window: {
            frame: false,
        },
        actions: {
            'time-delta': UIPanel.timeDeltaButtonHandler,
        },
    }

    static PARTS = {
        form: {
            template: `modules/${MODULE_ID}/templates/uipanel.hbs`,
        },
    }

    #time = {}
    refresh = foundry.utils.debounce(this.render, 100)

    init () {
        Hooks.on(Timekeeper.TIME_CHANGE_HOOK, this.timeChangeHandler.bind(this))
        if (!UIPanel.DEFAULT_OPTIONS.window.frame) this.#insertAppElement('#players')
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
        this.#time = structuredClone(data.time)
        this.#time.days += 1 // display 1-based instead of 0-based
        this.render(true)
    }

    _onRender (context, options) {
        // const timeButtons = this.element.querySelectorAll('[data-action=time-delta]')
        // for (const button of timeButtons) {
        //     button.addEventListener('click', this.testClick.bind(this))
        // }
    }

    _prepareContext (options) {
        const context = { time: this.#time }
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

    static get #smallTimeDelta () {
        return game.settings.get(MODULE_ID, SETTINGS.SMALL_TIME_DELTA)
    }

    static get #largeTimeDelta () {
        return game.settings.get(MODULE_ID, SETTINGS.LARGE_TIME_DELTA)
    }
}
