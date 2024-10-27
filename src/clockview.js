/**
 * Encapsulates the Clock view for Dragonbane Timekeeping
 */
import { MODULE_ID, SETTINGS } from './settings.js'

export class ClockView {
    #constants = null
    #stretchClock = null

    /**
     * Construct a ClockView instance
     */
    constructor (constants) {
        console.debug('DB Time | ClockView Checking for Clocks')
        this.#constants = constants

        this.#initStretchClock()
    }

    /**
     * Validates a Global Progress Clock clock.
     * Since so much of these scripts depend on these clocks being configured correctly, but
     * that configuration is outside the control of the scripts, the least I can do is check
     * that it's right.
     * @param {Object} clock The clock to check.
     * @param {string} name The clock name.
     * @param {number} segments The expected number of segments.
     */
    #validate_clock (clock, name, segments, optional = false) {
        if (!optional && !clock)
            throw new Error(`DBTime: Global Progress Clock '${name}' missing`)

        if (clock && clock.max != segments)
            throw new Error(
                `DBTime: Global Progress Clock '${name}' has ${clock.max} segments, it requires ${segments}`
            )
    }

    /**
     * Gets a validated timekeeping progress clock by name.
     * @param {string} name
     * @param {number} segments The expected number of clock segments
     * @param {boolean} optional An optional clock will return null if it is missing, while a required clock will raise an exception if missing.
     * @returns {Object} The validated Global Progress Clocks clock object, or null if a valid clock could not be found.
     */
    #getValidClock (name, segments, optional = false) {
        var clock = null
        try {
            clock = window.clockDatabase.getName(name)
        } catch (error) {
            ui.notifications.error(
                'The Global Progress Clocks module is probably not loaded'
            )
            return null
        }

        try {
            this.#validate_clock(clock, name, segments, optional)
        } catch (error) {
            ui.notifications.error(error)
            return null
        }

        return clock
    }

    #initStretchClock () {
        // The number of segments depends on whether there's an hour clock between the stretch clock and the shift clock
        const stretchClockSegments = this.#showHours
            ? this.#constants.stretchesPerHour
            : this.#constants.stretchesPerShift

        // First, see if a valid stretch clock exists
        this.#stretchClock = this.#getValidClock(
            this.#stretchClockName,
            stretchClockSegments,
            true // Say it's optional, since we'll make one if it's not there.
        )
        
        const id = foundry.utils.randomID()
        console.log(`clock id: ${id}`)

        // TODO: This validation pattern doesn't translate from the script version.
        // If validations fails, then making a new clock might not work either.
        if (!this.#stretchClock) {
            // make a new stretch clock
            console.log('making new clock')
            window.clockDatabase.addClock({
                value: 0,
                max: stretchClockSegments,
                name: this.#stretchClockName,
                id: id,
                private: false,
            })
        }
    }

    get #stretchClockName () {
        return (
            game.settings.get(MODULE_ID, SETTINGS.BASE_TIME_CLOCK) || 'Stretch'
        )
    }

    get #showHours () {
        return game.settings.get(MODULE_ID, SETTINGS.SHOW_HOURS)
    }
}
