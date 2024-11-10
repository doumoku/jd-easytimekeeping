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
        id: UIPanel.ID,
        window: {
            frame: false,
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
    }

    timeChangeHandler (data) {
        this.#time = structuredClone(data.time)
        this.#time.days += 1 // display 1-based instead of 0-based
        this.render(true)
    }

    _onRender (context, options) {}

    _prepareContext (options) {
        const context = { time: this.#time }
        return context
    }
}
