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
        classes: ['ui-panel', 'app'],
        id: UIPanel.ID,
        window: {
            frame: false,
        },
        position: {
            top: 400,
            left: 50,
            width: 300,
            height: 80,
        },
        actions: {
            'time-delta': UIPanel.smallJump,
        },
    }

    static PARTS = {
        form: {
            template: `modules/${MODULE_ID}/templates/uipanel.hbs`,
        },
    }

    #time = {}
    refresh = foundry.utils.debounce(this.render, 200)

    init () {
        Hooks.on(Timekeeper.TIME_CHANGE_HOOK, this.timeChangeHandler.bind(this))

        /**
         * This creates a DOM element in the ui-left interface div,
         * in between the canvas controls and the players panel.
         * Technique from Global Progress Clocks.
         * Shame it doesn't appear to work with ApplicationV2, since it put the UI exactly where I wanted it
         * */
        // const top = document.querySelector('#controls')
        // if (top) {
        //     const template = document.createElement('template')
        //     template.setAttribute('id', UIPanel.ID)
        //     top.insertAdjacentElement('afterend', template)
        // } else {
        //     console.error('JD ETime | Could not initialise UI Panel')
        // }
    }

    timeChangeHandler (data) {
        this.#time = structuredClone(data.time)
        this.#time.days += 1 // display 1-based instead of 0-based
        this.render(true)
    }

    _onRender (context, options) {
        // I don't need this. The Actions works when the application has a frame, and nothing works when it doesn't
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
    static smallJump (event, target) {
        console.log(this, target)
        ui.notifications.notify('small jump')
    }

    testClick (event, target) {
        console.log(this)
        ui.notifications.notify('clicked')
    }
}
