/**
 * Helper functions I seem to use everywhere.
 *
 * Many started out as class methods, but rather than
 * add class dependencies just to call these functions,
 * I'm moving them here.
 */

import { MODULE_ID, SETTINGS } from './settings.mjs'
import { Constants } from './constants.mjs'

export class Helpers {
    /**
     * Returns the current time of day as a formatted string.
     * Current module settings for 12 or 24 hour time are honoured.
     *
     * @param {import('./timekeeper.mjs').timeAugmented} time A Timekeeper time object
     * @param {Object} [options]
     * @param {boolean} [options.includeDay=false] Whether the day is included, or just the time
     * @param {string} [options.i18nFormatter='JDTIMEKEEPING.timeOfDay'] The formatter to use
     * @returns {string} the formatted time string
     */
    static toTimeString (time, options) {
        const timeOfDay = Helpers.toTimeOfDay(time)
        if (options?.includeDay) {
            const formatter = options?.i18nFormatter || 'JDTIMEKEEPING.timeOfDay'
            return game.i18n.format(formatter, { time: timeOfDay, day: time.days + 1 })
        } else {
            return timeOfDay
        }
    }

    /**
     * Gets the formatted time as a string "hh:mm [AM|PM]"
     * @param {import('./timekeeper.mjs').timeAugmented} time A Timekeeper time object
     * @param {string} [mode='auto'] Time mode. 'auto' uses the module setting
     */
    static toTimeOfDay (time, mode = 'auto') {
        const theMode = mode === 'auto' ? Helpers.timeDisplayMode : mode
        if (theMode === '12hour') {
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

    static get timeDisplayMode () {
        return game.settings.get(MODULE_ID, SETTINGS.DISPLAY_24_HOUR_TIME) ? '24hour' : '12hour'
    }

    static splitTimeString (s) {
        const split = s.split(':')
        return { days: 1, hours: Number.parseInt(split[0]), minutes: Number.parseInt(split[1]) }
    }

    /**
     * Factors a time object into Dragonbane stretches, shifts and days
     */
    static factorDragonbaneTime (time) {
        const dbtime = {}
        dbtime.totalStretches = Math.floor(time.totalMinutes / Constants.minutesPerStretch)
        var remainingStretches = dbtime.totalStretches
        dbtime.days = Math.floor(remainingStretches / Constants.stretchesPerDay)
        remainingStretches = remainingStretches % Constants.stretchesPerDay
        dbtime.shifts = Math.floor(remainingStretches / Constants.stretchesPerShift)
        dbtime.stretches = remainingStretches % Constants.stretchesPerShift

        return dbtime
    }

    static dbShifts = {
        0: 'nightName',
        1: 'morningName',
        2: 'afternoonName',
        3: 'eveningName',
    }

    /**
     * Looks up the Dragonbane shift name from a shift index.
     * night: 12am to 6am
     * morning: 6am to 12pm
     * afternoon: 12pm to 6pm
     * evening: 6pm to 12am
     * 
     * @param {number} shiftIndex The shift index, where 0 is the night shift, 1 is morning, 2 is afternoon, and 3 is evening.
     */
    static getDragonbaneShiftName (shiftIndex) {
        if (Helpers.dbShifts.hasOwnProperty(shiftIndex)) {
            const shiftSettings = game.settings.get(MODULE_ID, SETTINGS.SHIFT_SETTINGS)
            return shiftSettings[this.dbShifts[shiftIndex]]
        }
        return ''
    }

    // not the greatest approach, but 
    static objectsShallowEqual (obj1, obj2) {
        const entries1 = Object.entries(obj1)
        const entries2 = Object.entries(obj2)

        if (entries1.length !== entries2.length) {
            return false
        }

        for (let [key, value] of entries1) {
            if (obj2[key] !== value) {
                return false
            }
        }

        return true
    }

    /**
     * Check if the exact time of day can be seen by the current user based 
     * on user role and module settings
     * 
     * @returns {boolean} `true` if the exact time can be shown, `false` otherwise
     */
    static get showExactTime () {
        // The time of day string is always shown for a GM, and conditionally for
        // players based on the module setting
        return game.user.isGM || game.settings.get(MODULE_ID, SETTINGS.SHOW_PLAYERS_EXACT_TIME)
    }
}
