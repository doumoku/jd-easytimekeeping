/**
 * Encapsulates the Clock view for Dragonbane Timekeeping
 */
import { MODULE_ID, SETTINGS } from './settings.mjs'
import { Helpers } from './helpers.mjs'
import { Timekeeper } from './timekeeper.mjs'

export class TimeTeller {
    static init () {
        Hooks.on(Timekeeper.TIME_CHANGE_HOOK, TimeTeller.timeChangeHandler)
    }

    static timeChangeHandler (data) {
        TimeTeller.#checkAutoTellTime(data.time)
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
        const timeOfDay = Helpers.toTimeOfDay(time, '12hour')
        if (tellTimeSettings[timeOfDay]) this.tellTime(time)
    }
}
