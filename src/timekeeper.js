/**
 * Dragonbane Timekeeping API and core functionality.
 *
 */

import { SETTINGS, MODULE_ID } from './settings.js'

export class Timekeeper {
    #constants = null
    #clockView = null

    constructor (constants, clockView) {
        console.debug('DB Time | Timekeeper created')

        this.#constants = constants
        this.#clockView = clockView
        
    // set the time to the current time to force an update of the clockview
    // this is particularly required if ClockView has just created brand new clocks
        // this.set(this.#totalElapsedTicks)
    }

    /**
     * Gets the constants object, containing useful values relating to time as currently defined.
     */
    get constants () {
        return this.#constants
    }

    /**
     * Increment the current time.
     *
     * @param {Number} increment The number of ticks to increment.
     */
    async increment (increment = 1) {
        console.debug('DB Time | incrementing %d ticks', increment)

        if (increment > 0) {
            const currentTime = this.#factorTime(this.#totalElapsedTicks)
            const newTime = this.#factorTime(
                this.#totalElapsedTicks + increment
            )
            console.debug('DB Time | Current time %o', currentTime)
            console.log('DB Time | Incrementing to new time %o', newTime)
            this.#totalElapsedTicks += increment
            this.#notify(currentTime, newTime)
        }
    }

    /**
     * Set the time to the given total number of ticks since tick 0 on day 0, which is 6am on day 0. This is
     * mostly used by the Reset Clocks macro, though it can be used to set the time to any value so long as you calculate
     * the total number of ticks required. There are 24 ticks per shift, 4 ticks per hour, 6 hours per shift,
     * 4 shifts per day, and therefore 96 ticks per day.
     *
     * @param {Number} totalTicks The total number of ticks since tick 0 on day 0
     */
    async set (totalTicks = 0) {
        if (totalTicks >= 0) {
            const currentTime = this.#factorTime(this.#totalElapsedTicks)
            const newTime = this.#factorTime(totalTicks)
            console.debug('DB Time | Current time %o', currentTime)
            console.log('DB Time | Setting new time %o', newTime)
            this.#totalElapsedTicks = totalTicks
            this.#notify(currentTime, newTime)
        }
    }

    /**
     * Posts the current time to chat.
     */
    tellTime () {
        console.debug('DB Time | tellTime')
        // Get the current time object, then hand off to the clock view to tell the time in
        // an appropriate way. This API class is trying to keep it's hands out of the display business.
        const currentTime = this.#factorTime(this.#totalElapsedTicks)
        this.#clockView.tellTime(currentTime)
    }

    /**
     * Notifies of a change in the time.
     *
     * @param {Object} currentTime
     * @param {Object} newTime
     */
    #notify (currentTime, newTime) {
        this.#clockView.updateTime(newTime)
        // TODO: call a hook for world macros
        // TODO: call a macro from a module setting UUID
    }

    /**
     * Factors a time in total ticks into a time object, with the time given in
     * ticks (ticks/turns), hours, shifts, & days, the time of day, and the total elapsed ticks.
     */
    #factorTime (ticks) {
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
        // Each day starts at 6am with shift 0.
        let minutesSinceSixAM =
            time.tick * this.#constants.minutesPerTick +
            time.shift *
                this.#constants.minutesPerTick *
                this.#constants.ticksPerShift

        // handle optional hours
        if (time.hour) minutesSinceSixAM += time.hour * 60

        // factor into hours and minutes
        let hours = Math.floor(minutesSinceSixAM / 60) + 6 // add 6 since 0 is 6 am
        const minutes = minutesSinceSixAM % 60

        // handle AM and PM, and after midnight wrapping
        const amPm = hours < 12 || hours >= 24 ? 'AM' : 'PM'
        if (hours > 24) hours -= 24
        if (hours >= 13) hours -= 12

        time.timeOfDay = `${hours}:${minutes
            .toString()
            .padStart(2, '0')} ${amPm}`
    }

    /**
     * Gets the total elapsed ticks since tick 0 on day 0
     */
    get #totalElapsedTicks () {
        return game.settings.get(MODULE_ID, SETTINGS.TOTAL_ELAPSED_TIME)
    }

    /**
     * Sets the total elapsed ticks since tick 0 on day 0
     */
    set #totalElapsedTicks (ticks) {
        if (ticks != this.#totalElapsedTicks) {
            game.settings.set(MODULE_ID, SETTINGS.TOTAL_ELAPSED_TIME, ticks)
            // const changeMacro = game.macros.getName('test-change-macro')
            // if (changeMacro) changeMacro.execute()
        }
    }
}
