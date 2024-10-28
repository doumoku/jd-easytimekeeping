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
        console.debug('DB Time | ClockView Checking for Clocks')
        this.#constants = constants

        this.#initStretchClock()
        this.#initOptionalClock(
            this.showHours,
            SETTINGS.HOUR_CLOCK_ID,
            constants.hoursPerShift,
            'Hour'
        )
        this.#initShiftClock()
        this.#initOptionalClock(
            this.showDays,
            SETTINGS.DAY_CLOCK_ID,
            constants.maxDaysTracked,
            'Day'
        )
    }

    // TODO: I'm not convinced that giving Timekeeper access to these is the right approach.
    // I'll implement the timekeeping code first and then see what pattern emerges as the best way
    // to update ClockView when it needs to display the results.
    /*
    get stretchClock () {
        return this.#getClock(SETTINGS.STRETCH_CLOCK_ID)
    }

    get hourClock () {
        return this.#getClock(SETTINGS.HOUR_CLOCK_ID)
    }

    get shiftClock () {
        return this.#getClock(SETTINGS.SHIFT_CLOCK_ID)
    }

    get dayClock () {
        return this.#getClock(SETTINGS.DAY_CLOCK_ID)
    }
    */

    #initStretchClock () {
        // The number of segments depends on whether there's an hour clock between the stretch clock and the shift clock
        const stretchClockSegments = this.showHours
            ? this.#constants.stretchesPerHour
            : this.#constants.stretchesPerShift

        this.#getOrCreateClock(
            SETTINGS.STRETCH_CLOCK_ID,
            stretchClockSegments,
            this.#stretchClockName
        )
    }

    #initOptionalClock (showClock, idKey, segments, name) {
        if (showClock) {
            this.#getOrCreateClock(idKey, segments, name)
        } else {
            this.#deleteClock(idKey)
        }
    }

    #initShiftClock () {
        this.#getOrCreateClock(
            SETTINGS.SHIFT_CLOCK_ID,
            this.#constants.shiftsPerDay,
            'Shift'
        )
    }

    /**
     * Get or create a Global Progress Clock.
     *
     * @param {String} idKey the key to the module setting that stores the clock ID
     * @param {Number} segments the number of segments this clock is required to have
     * @param {String} name the expected clock name
     */
    #getOrCreateClock (idKey, segments, name) {
        const clock = this.#getClock(idKey)
        if (clock) {
            // ensure the right number of segments and name
            if (clock.max != segments || clock.name != name) {
                window.clockDatabase.update({
                    id: clock.id,
                    max: segments,
                    name: name,
                })
            }
        } else {
            // make a new clock
            const id = foundry.utils.randomID()
            window.clockDatabase.addClock({
                value: 0,
                max: segments,
                name: name,
                id: id,
                private: false,
            })

            // store the id
            game.settings.set(MODULE_ID, idKey, id)
        }
    }

    #getClock (key) {
        return window.clockDatabase.get(game.settings.get(MODULE_ID, key))
    }

    #deleteClock (key) {
        window.clockDatabase.delete(game.settings.get(MODULE_ID, key))
        game.settings.set(MODULE_ID, key, '')
    }

    get #stretchClockName () {
        return (
            game.settings.get(MODULE_ID, SETTINGS.BASE_TIME_CLOCK) || 'Stretch'
        )
    }

    get showHours () {
        return game.settings.get(MODULE_ID, SETTINGS.SHOW_HOURS)
    }

    get showDays () {
        return game.settings.get(MODULE_ID, SETTINGS.SHOW_DAYS)
    }
}
