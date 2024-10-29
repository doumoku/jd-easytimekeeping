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
        console.debug('DB Time | ClockView Checking for Clocks')
        this.#initTickClock()
        this.#initOptionalClock(
            this.showHours,
            SETTINGS.HOUR_CLOCK_ID,
            this.#constants.hoursPerShift,
            game.i18n.localize('DBTIME.Settings.HourClockName')
        )
        this.#initShiftClock()
        this.#initOptionalClock(
            this.showDays,
            SETTINGS.DAY_CLOCK_ID,
            this.#constants.maxDaysTracked,
            game.i18n.localize('DBTIME.Settings.DayClockName')
        )
    }

    updateTime (time) {
        this.#updateClock(this.#tickClock, time.tick)
        this.#updateClock(this.#shiftClock, time.shift)
        if (this.showHours) this.#updateClock(this.#hourClock, time.hour)
        if (this.showDays) this.#updateClock(this.#dayClock, time.day)

        this.#checkAutoTellTime(time)
    }

    tellTime (time) {
        let content = `It's ${time.timeOfDay} on day ${time.day + 1}` // display in 1-based days

        // TODO: decide if the module setting to not show the day clock means that the current day should also be hidden
        // from the tellTime chat message
        // if (this.showDays) content += ` on day ${time.day + 1}` // display in 1-based days

        console.log('DB Time | %s', content)

        ChatMessage.create({
            speaker: { actor: game.user.id },
            content: content,
        })
    }

    #updateClock (clock, value) {
        if (clock) {
            value += 1 // handle the conversion from the 0-based units to 1-based for display in GPC
            // display values are clamped to the range [1..clock.max]
            value = Math.max(1, Math.min(clock.max, value))
            if (clock.value != value) {
                window.clockDatabase.update({ id: clock.id, value })
            }
        } else {
            const warning =
                'DB Time | An expected clock is missing. Reloading Foundry should restore it.'
            ui.notifications.warn(warning)
        }
    }

    get #tickClock () {
        return this.#getClock(SETTINGS.TICK_CLOCK_ID)
    }

    get #hourClock () {
        return this.#getClock(SETTINGS.HOUR_CLOCK_ID)
    }

    get #shiftClock () {
        return this.#getClock(SETTINGS.SHIFT_CLOCK_ID)
    }

    get #dayClock () {
        return this.#getClock(SETTINGS.DAY_CLOCK_ID)
    }

    #initTickClock () {
        // The number of segments depends on whether there's an hour clock between the tick clock and the shift clock
        const tickClockSegments = this.showHours
            ? this.#constants.ticksPerHour
            : this.#constants.ticksPerShift

        this.#getOrCreateClock(
            SETTINGS.TICK_CLOCK_ID,
            tickClockSegments,
            this.#tickClockName
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
            game.i18n.localize('DBTIME.Settings.ShiftClockName')
        )
    }

    /**
     * Get or create a Global Progress Clock.
     *
     * @param {String} idKey the key to the module setting that stores the clock ID
     * @param {Number} segments the number of segments this clock is required to have
     * @param {String} name the expected clock name
     */
    async #getOrCreateClock (idKey, segments, name) {
        const clock = this.#getClock(idKey)
        if (clock) {
            // ensure the right number of segments and name
            if (clock.max != segments || clock.name != name) {
                await window.clockDatabase.update({
                    id: clock.id,
                    max: segments,
                    name: name,
                })
            }
        } else {
            // make a new clock
            const id = foundry.utils.randomID()
            await window.clockDatabase.addClock({
                value: 0,
                max: segments,
                name: name,
                id: id,
                private: false,
            })

            // store the id
            await game.settings.set(MODULE_ID, idKey, id)
        }
    }

    #getClock (key) {
        return window.clockDatabase.get(game.settings.get(MODULE_ID, key))
    }

    #deleteClock (key) {
        window.clockDatabase.delete(game.settings.get(MODULE_ID, key))
        game.settings.set(MODULE_ID, key, '')
    }

    get #tickClockName () {
        return game.settings.get(MODULE_ID, SETTINGS.BASE_TIME_CLOCK) || 'Tick'
    }

    get showHours () {
        return game.settings.get(MODULE_ID, SETTINGS.SHOW_HOURS)
    }

    get showDays () {
        return game.settings.get(MODULE_ID, SETTINGS.SHOW_DAYS)
    }

    #checkAutoTellTime (time) {
        const tellTimeSettings = game.settings.get(
            MODULE_ID,
            SETTINGS.AUTO_TELL_TIME_SETTINGS
        )
        if (tellTimeSettings[time.timeOfDay]) 
            this.tellTime(time)
    }
}
