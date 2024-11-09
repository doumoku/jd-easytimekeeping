/**
 * Encapsulates the Clock view for Dragonbane Timekeeping
 */
import { MODULE_ID, SETTINGS } from './settings.js'

export class ClockView {
    #constants = null

    /**
     * Construct a ClockView instance
     */
    constructor (constants) {
        this.#constants = constants
    }

    initialise () {
        console.debug('JD ETime | ClockView Checking for Clocks')
    }

    updateTime (time) {
        this.#checkAutoTellTime(time)
    }

    tellTime (time) {
        const timeOfDay = this.#toTimeOfDay(time)
        let content = `It's ${timeOfDay} on day ${time.days + 1}` // display in 1-based days
        console.log('JD ETime | %s', content)
        ChatMessage.create({
            speaker: { actor: game.user.id },
            content: content,
        })
    }

    #checkAutoTellTime (time) {
        const tellTimeSettings = game.settings.get(MODULE_ID, SETTINGS.AUTO_TELL_TIME_SETTINGS)
        const timeOfDay = this.#toTimeOfDay(time, true)
        if (tellTimeSettings[timeOfDay]) this.tellTime(time)
    }

    #toTimeOfDay (time, force12Hour = false) {
        // time.hour is a value from 0 to 23
        if (force12Hour || !this.#is24HourDisplay) {
            const amPm = time.hour >= 12 ? 'PM' : 'AM'
            let hour = time.hour > 12 ? time.hour - 12 : time.hour
            if (hour === 0) hour = 12
            return `${hour}:${time.minute.toString().padStart(2, '0')} ${amPm}`
        } else {
            return `${time.hour.toString().padStart(2, '0')}:${time.minute
                .toString()
                .padStart(2, '0')}`
        }
    }

    get #is24HourDisplay () {
        return game.settings.get(MODULE_ID, SETTINGS.DISPLAY_24_HOUR_TIME)
    }
}
