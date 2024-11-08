/**
 * Dragonbane Timekeeping API and core functionality.
 *
 */

import { SETTINGS, MODULE_ID } from './settings.js'

export class Timekeeper {
    #constants = null
    #clockView = null
    #daylightCycle = null

    static TIME_CHANGE_HOOK = 'dbtimeTimeChangedHook'

    constructor (constants, clockView, daylightCycle) {
        console.debug('DB Time | Timekeeper created')
        this.#constants = constants
        this.#clockView = clockView
        this.#daylightCycle = daylightCycle
    }

    initialise () {
        // set the time to the current time to force an update of the clockview
        // this is particularly required if ClockView has just created brand new clocks
        this.set(this.#totalElapsedMinutes)
    }

    /**
     * Gets the constants object, containing useful values relating to time as currently defined.
     */
    get constants () {
        return this.#constants
    }

    /**
     * Private method to actually increment the current time.
     *
     * @param {Number} minutes The number of minutes to increment.
     */
    #increment (minutes = 1) {
        console.debug('DB Time | incrementing %d minutes', minutes)

        if (minutes > 0) {
            const oldTime = this.#factorTime(this.#totalElapsedMinutes)
            const newTime = this.#factorTime(this.#totalElapsedMinutes + minutes)
            console.debug('DB Time | Current time %o', oldTime)
            console.log('DB Time | Incrementing to new time %o', newTime)
            this.#totalElapsedMinutes += minutes
            this.#notify(oldTime, newTime)
        }
    }

    /**
     * Private method to actually set the time.
     *
     * @param {Number} totalMinutes The total number of minutes since 0:00 on day 0
     */
    #set (totalMinutes = 0) {
        if (totalMinutes >= 0) {
            const oldTime = this.#factorTime(this.#totalElapsedMinutes)
            const newTime = this.#factorTime(totalMinutes)
            console.debug('DB Time | Current time %o', oldTime)
            console.log('DB Time | Setting new time %o', newTime)
            this.#totalElapsedMinutes = totalMinutes
            this.#notify(oldTime, newTime)
        }
    }

    /**
     * Increment the time.
     *
     * @param {Object} time the time interval to increment by
     * @param {Number} [time.days=0] days
     * @param {Number} [time.hours=0] hours
     * @param {Number} [time.minutes=10] minutes
     */
    increment (time) {
        if (!time) time = { minutes: 10 }
        this.#increment(this.#toTotalMinutes(time))
    }

    /**
     * Set the time.
     *
     * @param {Object} time the time to set
     * @param {Number} [time.days=0] days
     * @param {Number} [time.hours=0] hours
     * @param {Number} [time.minutes=10] minutes
     */
    set (time) {
        if (!time) time = 0
        this.#set(this.#toTotalMinutes(time))
    }

    #toTotalMinutes (time) {
        if (typeof time === 'number') {
            return time
        } else {
            // TODO: calc minutes
        }
    }

    /**
     * Posts the current time to chat.
     */
    tellTime () {
        console.debug('DB Time | tellTime')
        // Get the current time object, then hand off to the clock view to tell the time in
        // an appropriate way. This API class is trying to keep it's hands out of the display business.
        const currentTime = this.#factorTime(this.#totalElapsedMinutes)
        this.#clockView.tellTime(currentTime)
    }

    /**
     * Notifies of a change in the time.
     *
     * @param {Object} oldTime the previous time
     * @param {Number} oldTime.totalMinutes total minutes
     * @param {Number} oldTime.day days
     * @param {String} oldTime.timeOfDay hh:mm [AM|PM]
     * @param {Object} oldTime.timeOfDay24HourNumeric the time of day in 24 hour numeric format
     * @param {Number} oldTime.timeOfDay24HourNumeric.hours
     * @param {Number} oldTime.timeOfDay24HourNumeric.minutes
     * @param {Object} newTime the new time
     * @param {Number} newTime.totalMinutes total minutes
     * @param {Number} newTime.day days
     * @param {String} newTime.timeOfDay hh:mm [AM|PM]
     * @param {Object} newTime.timeOfDay24HourNumeric the time of day in 24 hour numeric format
     * @param {Number} newTime.timeOfDay24HourNumeric.hours
     * @param {Number} newTime.timeOfDay24HourNumeric.minutes
     */
    #notify (oldTime, newTime) {
        const data = { oldTime: oldTime, time: newTime }
        this.#clockView.updateTime(newTime)
        this.#daylightCycle.updateTime(newTime)

        Hooks.callAll(Timekeeper.TIME_CHANGE_HOOK, data)

        /**
         * Macros can't listen to hooks, so if there is a macro registered in the
         * module settings then we'll call it
         */
        const timeChangeMacro = this.#timeChangeMacro
        if (timeChangeMacro) {
            timeChangeMacro.execute(data)
        }
    }

    /**
     * Factors a time in total ticks into a time object, with the time given in
     * ticks (ticks/turns), hours, shifts, & days, the time of day, and the total elapsed ticks.
     */
    #factorTime (ticks) {
        // TODO: update to new time formats
        const time = {
            tick: 0,
            shift: 0,
            day: 0,
            totalTicks: ticks,
        }

        var ticksLeft = ticks
        // how many days?
        time.day = Math.floor(ticks / this.#constants.ticksPerDay)
        ticksLeft = ticksLeft % this.#constants.ticksPerDay
        // how many shifts?
        time.shift = Math.floor(ticksLeft / this.#constants.ticksPerShift)
        ticksLeft = ticksLeft % this.#constants.ticksPerShift
        // if we are using hours, then calculate how many whole hours we have
        if (this.#clockView.showHours) {
            time.hour = Math.floor(ticksLeft / this.#constants.ticksPerHour)
            ticksLeft = ticksLeft % this.#constants.ticksPerHour
        }
        // This is the final remainder of ticks regardless of whether the optional hours are in use or not
        time.tick = ticksLeft

        this.#calculateTimeOfDay(time)

        return time
    }

    #calculateTimeOfDay (time) {
        // TODO: update to new time formats
        // Each day starts at 6am with shift 0.
        let minutesSinceSixAM =
            time.tick * this.#constants.minutesPerTick +
            time.shift * this.#constants.minutesPerTick * this.#constants.ticksPerShift

        // handle optional hours
        if (time.hour) minutesSinceSixAM += time.hour * 60

        // factor into hours and minutes
        let hours = Math.floor(minutesSinceSixAM / 60) + 6 // add 6 since 0 is 6 am
        const minutes = minutesSinceSixAM % 60

        // handle AM and PM, and after midnight wrapping
        const amPm = hours < 12 || hours >= 24 ? 'AM' : 'PM'
        if (hours > 24) hours -= 24

        // Store the 24 hour time as a numeric object since that's also helpful
        time.timeOfDay24HourNumeric = { hours: hours, minutes: minutes }

        if (hours >= 13) hours -= 12

        time.timeOfDay = `${hours}:${minutes.toString().padStart(2, '0')} ${amPm}`
    }

    /**
     * Gets the total elapsed ticks since tick 0 on day 0
     */
    get #totalElapsedMinutes () {
        return game.settings.get(MODULE_ID, SETTINGS.TOTAL_ELAPSED_MINUTES)
    }

    /**
     * Sets the total elapsed ticks since tick 0 on day 0
     */
    set #totalElapsedMinutes (minutes) {
        if (minutes != this.#totalElapsedMinutes) {
            game.settings.set(MODULE_ID, SETTINGS.TOTAL_ELAPSED_MINUTES, minutes)
        }
    }

    get #timeChangeMacro () {
        return game.macros.find(
            m => m.uuid === game.settings.get(MODULE_ID, SETTINGS.TIME_CHANGE_MACRO)
        )
    }
}
