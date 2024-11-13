/**
 * Helper functions I seem to use everywhere.
 *
 * Many started out as class methods, but rather than
 * add class dependencies just to call these functions,
 * I'm moving them here.
 */

import { MODULE_ID, SETTINGS } from './settings.mjs'
import { Constants } from './constants.mjs'
import { Timekeeper } from './timekeeper.mjs'

export class Helpers {
    static toTimeString (time, includeDay = false) {
        const timeOfDay = Helpers.toTimeOfDay(time)
        return includeDay
            ? game.i18n.format('JDTIMEKEEPING.timeOfDay', { time: timeOfDay, day: time.days + 1 })
            : timeOfDay
    }

    static toTimeOfDay (time, force12Hour = false) {
        // time.hours is a value from 0 to 23
        if (force12Hour || !this.is24HourDisplay) {
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

    static get is24HourDisplay () {
        return game.settings.get(MODULE_ID, SETTINGS.DISPLAY_24_HOUR_TIME)
    }
}
