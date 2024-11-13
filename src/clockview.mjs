/**
 * Encapsulates the Clock view for Dragonbane Timekeeping
 */
import { MODULE_ID, SETTINGS } from './settings.mjs'
import { Helpers } from './helpers.mjs'
import { Timekeeper } from './timekeeper.mjs'

export class ClockView {
    static init () {
        Hooks.on(Timekeeper.TIME_CHANGE_HOOK, ClockView.timeChangeHandler)
    }

    static timeChangeHandler (data) {
        ClockView.#checkAutoTellTime(data.time)
    }

    static tellTime (time) {
        const content = Helpers.toTimeString(time, true)
        console.log('JD ETime | %s', content)
        ChatMessage.create({
            speaker: { actor: game.user.id },
            content: content,
        })
    }

    static #checkAutoTellTime (time) {
        const tellTimeSettings = game.settings.get(MODULE_ID, SETTINGS.AUTO_TELL_TIME_SETTINGS)
        const timeOfDay = Helpers.toTimeOfDay(time, true)
        if (tellTimeSettings[timeOfDay]) this.tellTime(time)
    }
}
