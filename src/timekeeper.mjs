/**
 * Dragonbane Timekeeping API and core functionality.
 *
 */

import { SETTINGS, MODULE_ID } from './settings.mjs'

export class Timekeeper {
    #constants = null
    #clockView = null

    static TIME_CHANGE_HOOK = 'dbtimeTimeChangedHook'

    constructor (constants, clockView) {
        console.debug('JD ETime | Timekeeper created')
        this.#constants = constants
        this.#clockView = clockView
    }

    initialise () {
        // set the time to the current time to force an update of the clockview
        this.#set(this.#totalElapsedMinutes)
    }

    /**
     * Gets the constants object, containing useful values relating to time as currently defined.
     */
    get constants () {
        return this.#constants
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
        if (!game.user.isGM) {
            ui.notifications.warn(game.i18n.localize('JDTIMEKEEPING.NoPermission'))
            return false
        }

        // FIXME: The default time increment should come from module settings
        if (!time) time = { minutes: 10 }
        return this.#increment(this.#toTotalMinutes(time))
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
        if (!game.user.isGM) {
            ui.notifications.warn(game.i18n.localize('JDTIMEKEEPING.NoPermission'))
            return false
        }

        if (!time) time = 0
        return this.#set(this.#toTotalMinutes(time))
    }

    /**
     * Gets the current time
     */
    getTime () {
        return this.#factorTime(this.#totalElapsedMinutes)
    }

    /**
     * Gets the current time as a formatted string
     * @param {Boolean} includeDay Determines whether the current day is included in the string
     * @returns
     */
    toTimeString (includeDay = false) {
        return this.#clockView.toTimeString(this.#factorTime(this.#totalElapsedMinutes), includeDay)
    }

    /**
     * Posts the current time to chat.
     */
    tellTime () {
        console.debug('JD ETime | tellTime')
        const currentTime = this.#factorTime(this.#totalElapsedMinutes)
        this.#clockView.tellTime(currentTime)
    }

    /**
     * Private method to actually increment the current time.
     *
     * @param {Number} minutes The number of minutes to increment.
     */
    #increment (minutes = 1) {
        console.debug('JD ETime | incrementing %d minutes', minutes)

        if (minutes > 0) {
            const oldTime = this.#factorTime(this.#totalElapsedMinutes)
            const newTime = this.#factorTime(this.#totalElapsedMinutes + minutes)
            console.debug('JD ETime | Current time %o', oldTime)
            console.log('JD ETime | Incrementing to new time %o', newTime)
            this.#setTotalElapsedMinutes(this.#totalElapsedMinutes + minutes)
            return this.#notify(oldTime, newTime)
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
            console.debug('JD ETime | Current time %o', oldTime)
            console.log('JD ETime | Setting new time %o', newTime)
            this.#setTotalElapsedMinutes(totalMinutes)
            return this.#notify(oldTime, newTime)
        }
    }

    #toTotalMinutes (time) {
        if (typeof time === 'number') {
            return Math.round(time)
        } else {
            console.debug('JD ETime | toTotalMinutes time: %o', time)
            const total =
                (time.minutes ? time.minutes : 0) +
                (time.hours ? time.hours * 60 : 0) +
                (time.days ? time.days * this.#constants.minutesPerDay : 0)
            console.debug('JD ETime | toTotalMinutes total: %o', total)
            return Math.round(total)
        }
    }

    /**
     * Notifies of a change in the time.
     *
     * @param {Object} oldTime the previous time
     * @param {Number} oldTime.totalMinutes total minutes
     * @param {Number} oldTime.days days
     * @param {Number} oldTime.hours The hour of the day in 24 time
     * @param {Number} oldTime.minutes The minute of the hour
     * @param {Object} newTime the new time
     * @param {Number} newTime.totalMinutes total minutes
     * @param {Number} newTime.days days
     * @param {Number} newTime.hours The hour of the day in 24 time
     * @param {Number} newTime.minutes The minute of the hour
     */
    #notify (oldTime, newTime) {
        const data = { oldTime: oldTime, time: newTime }

        Hooks.callAll(Timekeeper.TIME_CHANGE_HOOK, data)

        /**
         * Macros can't listen to hooks, so if there is a macro registered in the
         * module settings then we'll call it
         */
        const timeChangeMacro = this.#timeChangeMacro
        if (timeChangeMacro) {
            timeChangeMacro.execute(data)
        }

        return data
    }

    /**
     * Factors a time in total minutes into a time object
     */
    #factorTime (totalMinutes) {
        const time = {}

        time.totalMinutes = totalMinutes
        time.days = Math.floor(totalMinutes / this.#constants.minutesPerDay)
        time.hours = Math.floor((totalMinutes % this.#constants.minutesPerDay) / 60)
        time.minutes = (totalMinutes % this.#constants.minutesPerDay) % 60

        return time
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
    async #setTotalElapsedMinutes (minutes) {
        await game.settings.set(MODULE_ID, SETTINGS.TOTAL_ELAPSED_MINUTES, Math.round(minutes))
    }

    get #timeChangeMacro () {
        return game.macros.find(
            m => m.uuid === game.settings.get(MODULE_ID, SETTINGS.TIME_CHANGE_MACRO)
        )
    }
}
