/**
 * Encapsulates the Clock view for Dragonbane Timekeeping
 */
import { MODULE_ID, SETTINGS } from './settings.mjs'

export class ClockView {
    #constants = null

    /**
     * Construct a ClockView instance
     */
    constructor (constants) {
        this.#constants = constants
    }

    initialise () {
        console.debug('JD ETime | ClockView Ready')
    }

    updateTime (time) {
        this.#checkAutoTellTime(time)
    }

    tellTime (time) {
        const content = this.toTimeString(time, true)
        console.log('JD ETime | %s', content)
        ChatMessage.create({
            speaker: { actor: game.user.id },
            content: content,
        })
    }

    toTimeString (time, includeDay = false) {
        const timeOfDay = this.#toTimeOfDay(time)
        return includeDay
            ? game.i18n.format('JDTIMEKEEPING.timeOfDay', { time: timeOfDay, day: time.days + 1 })
            : timeOfDay
    }

    #checkAutoTellTime (time) {
        const tellTimeSettings = game.settings.get(MODULE_ID, SETTINGS.AUTO_TELL_TIME_SETTINGS)
        const timeOfDay = this.#toTimeOfDay(time, true)
        if (tellTimeSettings[timeOfDay]) this.tellTime(time)
    }

    #toTimeOfDay (time, force12Hour = false) {
        // time.hours is a value from 0 to 23
        if (force12Hour || !this.#is24HourDisplay) {
            const amPm = time.hours >= 12 ? 'PM' : 'AM'
            let hour = time.hours > 12 ? time.hours - 12 : time.hours
            if (hour === 0) hour = 12
            return `${hour}:${time.minutes.toString().padStart(2, '0')} ${amPm}`
        } else {
            return `${time.hours.toString().padStart(2, '0')}:${time.minutes
                .toString()
                .padStart(2, '0')}`
        }
    }

    get #is24HourDisplay () {
        return game.settings.get(MODULE_ID, SETTINGS.DISPLAY_24_HOUR_TIME)
    }
}
