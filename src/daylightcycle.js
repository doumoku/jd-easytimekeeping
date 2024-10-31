/**
 * Implements the daylight cycle.
 *
 * In the cycle, the day is divided into 4 phases:
 * Dawn: darkness levels transition from night settings to day settings at each clock tick
 * Day: darkness levels are set to the day setting
 * Dusk: darkness levels transition from day to night settings at each clock tick
 * Night: darkness levels are set to the night setting
 *
 * The algorithm has two main stages:
 * 1: detect which phase the current time is in
 * 2: handle the lighting updates based on the phase
 *
 * Large jumps in time are handled easily.
 * In the day and night phases, the current scene darkness level is compared
 * directly to the target level and set to the target if it is different.
 * In the dawn and dusk phases, linear interpolation is used to progressively
 * move the scene darkness level towards the target value over the required number of
 * clock ticks.
 */
import { MODULE_ID, SETTINGS } from './settings.js'

const PHASES = {
    DAWN: 0,
    DAY: 1,
    DUSK: 2,
    NIGHT: 3,
}

export class DaylightCycle {
    #constants = null

    constructor (constants) {
        this.#constants = constants
    }

    initialise () {}

    updateTime (time) {
        if (!this.#enabled) return

        try {
            switch (this.#detectPhase(time)) {
                case PHASES.DAWN:
                    this.#processDawn(time)
                    break
                default:
                case PHASES.DAY:
                    this.#processDay(time)
                    break
                case PHASES.DUSK:
                    this.#processDusk(time)
                    break
                case PHASES.NIGHT:
                    this.#processNight(time)
                    break
            }
        } catch (error) {
            console.error(error)
        }
    }

    #detectPhase (time) {
        const dawnStart = this.#dawnStart
        const dawnEnd = this.#addTicksToTime(dawnStart, this.#dawnDurationTicks)
        const duskStart = this.#duskStart
        const duskEnd = this.#addTicksToTime(duskStart, this.#duskDurationTicks)

        console.log('dawnStart: %o', dawnStart)
        console.log('dawnEnd: %o', dawnEnd)
        console.log('dawnTicks: %o', this.#dawnDurationTicks)
        console.log('duskStart: %o', duskStart)
        console.log('duskEnd: %o', duskEnd)
        console.log('now: %o', time.timeOfDay24HourNumeric)

        return PHASES.DAY
    }

    #processDay (time) {
        console.debug('DB Time | Daylight cycle - day')
        if (this.#sceneDarkness != this.#daytimeDarkness) {
            console.log(
                'DB Time | Daylight cycle: setting daytime darkness %f',
                this.#daytimeDarkness
            )
            this.#setSceneDarkness(this.#daytimeDarkness)
        }
    }

    #processNight (time) {
        console.debug('DB Time | Daylight cycle - night')
        if (this.#sceneDarkness != this.#nighttimeDarkness) {
            console.log(
                'DB Time | Daylight cycle: setting nighttime darkness %f',
                this.#nighttimeDarkness
            )
            this.#setSceneDarkness(this.#nighttimeDarkness)
        }
    }

    #processDawn (time) {
        console.debug('DB Time | Daylight cycle - dawn')
    }

    #processDusk (time) {
        console.debug('DB Time | Daylight cycle - dusk')
    }

    /**
     * @param {String} timeOfDay The time of day as a string in the format 'hh:mm [AM/PM]'
     * @returns An object containing the integer hour and minute in 24 hour time
     */
    #parseTimeOfDay (timeOfDay) {
        const split = timeOfDay.split(/[ :]+/)
        const time = {
            hours: Number.parseInt(split[0]),
            minutes: Number.parseInt(split[1]),
        }

        if (split[2].toLocaleUpperCase() === 'PM' && time.hours < 12)
            time.hours += 12

        return time
    }

    /**
     * @param {Object} time the 24-hour time object from parsing a time string
     * @param {Number} ticks a positive integral number of ticks to add to the time
     */
    #addTicksToTime (time, ticks) {
        // Note that since this method is used only for adding the dawn and dusk duration to the start
        // times, it does not handle things like wrapping into a new day. The UI does not allow
        // time spans that are long enough for that.
        const totalMinutes =
            ticks * this.#constants.minutesPerTick +
            time.hours * 60 +
            time.minutes
        return {
            hours: Math.floor(totalMinutes / 60),
            minutes: totalMinutes % 60,
        }
    }

    /**
     * Methods to encapsulate settings and scene values, since they make for cleaner code
     */
    get #enabled () {
        return game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)[
            'daylight-cycle-enabled'
        ]
    }

    get #animateDarkness () {
        return game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)[
            'animate-darkness-ms'
        ]
    }

    get #daytimeDarkness () {
        return game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)[
            'day-darkness-level'
        ]
    }

    get #nighttimeDarkness () {
        return game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)[
            'night-darkness-level'
        ]
    }

    get #sceneDarkness () {
        return canvas.scene.environment.darknessLevel
    }

    async #setSceneDarkness (darkness) {
        await canvas.scene.update(
            { 'environment.darknessLevel': darkness },
            { animateDarkness: this.#animateDarkness }
        )
    }

    get #dawnStart () {
        return this.#parseTimeOfDay(
            game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)[
                'dawn-start'
            ]
        )
    }

    get #dawnDurationTicks () {
        return game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)[
            'dawn-duration-ticks'
        ]
    }

    get #duskStart () {
        return this.#parseTimeOfDay(
            game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)[
                'dusk-start'
            ]
        )
    }

    get #duskDurationTicks () {
        return game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)[
            'dusk-duration-ticks'
        ]
    }
}
