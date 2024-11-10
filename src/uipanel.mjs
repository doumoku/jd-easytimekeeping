/**
 * The UI panel.
 */
import { Timekeeper } from './timekeeper.mjs'
import { MODULE_ID, SETTINGS } from './settings.mjs'
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class UIPanel extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        // tag: 'form',
        id: 'jd-et-uipanel',
        window: {
            frame: true,
            resizable: true,
            title: 'UI Panel',
        },
        position: {
            top: 200,
            left: 200,
            width: 300,
            height: 200,
        },
    }

    static PARTS = {
        form: {
            template: `modules/${MODULE_ID}/templates/uipanel.hbs`,
        },
    }

    #time = {}

    init () {
        Hooks.on(Timekeeper.TIME_CHANGE_HOOK, this.timeChangeHandler.bind(this))
    }

    timeChangeHandler (data) {
        this.#time = structuredClone(data.time)
        this.#time.days += 1 // display 1-based instead of 0-based

        // FIXME: rendering the entire application is a terrible way to update one element when the time changes
        // This is just a quick test.
        this.render(true)
    }

    _onRender (context, options) {}

    _prepareContext (options) {
        const context = { time: this.#time }
        return context
    }
}
