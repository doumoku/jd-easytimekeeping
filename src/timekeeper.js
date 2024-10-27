/**
 * Dragonbane Timekeeping API and core functionality.
 *
 */

import { SETTINGS, MODULE_ID } from './settings.js'

// TODO: #1 bring over functionality from dbtime-engine.js prototype code
export class Timekeeper {
    #constants = null
    #clockView = null

    constructor (constants, clockView) {
        console.debug('DB Time | Timekeeper created')

        this.#constants = constants
        this.#clockView = clockView
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
     * @param {Number} stretches The number of stretches to increment.
     */
    async increment (stretches = 1) {
        console.debug('DB Time | incrementing %d stretches', stretches)

        // do some increment logic from the prototype code

        this.#totalElapsedTicks += stretches
    }

    /**
     * Set the time to the given total number of stretches since stretch 0 on day 0, which is 6am on day 0. This is
     * mostly used by the Reset Clocks macro, though it can be used to set the time to any value so long as you calculate
     * the total number of stretches required. There are 24 stretches per shift, 4 stretches per hour, 6 hours per shift,
     * 4 shifts per day, and therefore 96 stretches per day.
     *
     * @param {Number} totalStretches The total number of 15 minute stretches since 6am on day 0.
     */
    async set (totalStretches = 0) {
        console.debug(
            'DB Time | setting time to %d total stretches',
            totalStretches
        )
        this.#totalElapsedTicks = totalStretches
    }

    /**
     * Posts the current time to chat.
     * If the day clock is enabled in the module settings, then the day will be included in the chat message.
     */
    async tellTime () {
        console.debug('DB Time | tellTime')
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
            // TODO: this needs to receive all the data matching the prototype - oldTime, current time etc
            // TODO: rename once I converge on how I'm actually handling the change callbacks
            const changeMacro = game.macros.getName('test-change-macro')
            if (changeMacro) changeMacro.execute()
        }
    }
}
