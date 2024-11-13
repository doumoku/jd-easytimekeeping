/**
 * Encapsulates the Clock view for Dragonbane Timekeeping
 */
import { MODULE_ID, SETTINGS } from './settings.mjs'
import { Helpers } from './helpers.mjs'
import { Timekeeper } from './timekeeper.mjs'

export class ClockView {
    constructor () {
        Hooks.on(Timekeeper.TIME_CHANGE_HOOK, this.timeChangeHandler.bind(this))
    }

    init () {
        console.debug('JD ETime | ClockView Ready')
    }

    timeChangeHandler (data) {
        this.#checkAutoTellTime(data.time)
    }

    tellTime (time) {
        const content = Helpers.toTimeString(time, true)
        console.log('JD ETime | %s', content)
        ChatMessage.create({
            speaker: { actor: game.user.id },
            content: content,
        })
    }

    #checkAutoTellTime (time) {
        const tellTimeSettings = game.settings.get(MODULE_ID, SETTINGS.AUTO_TELL_TIME_SETTINGS)
        const timeOfDay = Helpers.toTimeOfDay(time, true)
        if (tellTimeSettings[timeOfDay]) this.tellTime(time)
    }
}
