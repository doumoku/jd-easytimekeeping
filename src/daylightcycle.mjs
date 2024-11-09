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
import { MODULE_ID, SETTINGS } from './settings.mjs'

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
                    this.#processDay()
                    break
                case PHASES.DUSK:
                    this.#processDusk(time)
                    break
                case PHASES.NIGHT:
                    this.#processNight()
                    break
            }
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Returns true if timeA is < timeB
     */
    #timeLT (timeA, timeB) {
        return (
            timeA.hours < timeB.hours ||
            (timeA.hours === timeB.hours && timeA.minutes < timeB.minutes)
        )
    }

    /**
     * Returns true if timeA is >= timeB
     */
    #timeGTE (timeA, timeB) {
        return !this.#timeLT(timeA, timeB)
    }

    #detectPhase (time) {
        const dawnStart = this.#dawnStart
        const dawnEnd = this.#addTicksToTime(dawnStart, this.#dawnDurationTicks)
        const duskStart = this.#duskStart
        const duskEnd = this.#addTicksToTime(duskStart, this.#duskDurationTicks)

        // console.debug('dawnStart: %O', dawnStart)
        // console.debug('dawnEnd: %O', dawnEnd)
        // console.debug('duskStart: %O', duskStart)
        // console.debug('duskEnd: %O', duskEnd)
        // console.debug('now: %O', time)

        // to avoid messing with the time roll-over at midnight, test for dawn, day and dusk.
        // it's night when it's not one of those three.
        if (this.#timeGTE(time, dawnStart) && this.#timeLT(time, dawnEnd)) {
            return PHASES.DAWN
        } else if (this.#timeGTE(time, dawnEnd) && this.#timeLT(time, duskStart)) {
            return PHASES.DAY
        } else if (this.#timeGTE(time, duskStart) && this.#timeLT(time, duskEnd)) {
            return PHASES.DUSK
        } else {
            return PHASES.NIGHT
        }
    }

    #processDay () {
        console.debug('JD ETime | Daylight cycle - day')
        if (this.#sceneDarkness != this.#daytimeDarkness) {
            console.log(
                'JD ETime | Daylight cycle: setting daytime darkness %f',
                this.#daytimeDarkness
            )
            this.#setSceneDarkness(this.#daytimeDarkness)
        }
    }

    #processNight () {
        console.debug('JD ETime | Daylight cycle - night')
        if (this.#sceneDarkness != this.#nighttimeDarkness) {
            console.log(
                'JD ETime | Daylight cycle: setting nighttime darkness %f',
                this.#nighttimeDarkness
            )
            this.#setSceneDarkness(this.#nighttimeDarkness)
        }
    }

    #processDawn (time) {
        console.debug('JD ETime | Daylight cycle - dawn')
        this.#processTwilightPhase(
            time,
            this.#dawnStart,
            this.#dawnDurationTicks,
            this.#nighttimeDarkness,
            this.#daytimeDarkness
        )
    }

    #processDusk (time) {
        console.debug('JD ETime | Daylight cycle - dusk')
        this.#processTwilightPhase(
            time,
            this.#duskStart,
            this.#duskDurationTicks,
            this.#daytimeDarkness,
            this.#nighttimeDarkness
        )
    }

    #processTwilightPhase (time, startTime, durationTicks, fromDarkness, toDarkness) {
        /**
         * Given:
         * 1. start, end, & duration in minutes of the phase
         * 2. current minute of the phase
         * 3. start, end, and current darkness levels
         *
         * then it's a linear interpolation problem.
         * The distance moved in minutes between the start and end of the phase
         * as a proportion of the total duration gives the amount to scale the
         * darkness level as it increments between the starting and target values.
         *
         * We don't need to test for overrunning the end of the phase. That's
         * already handled before this method is called.
         */

        const endTime = this.#addTicksToTime(startTime, durationTicks)
        const startMinute = startTime.hours * 60 + startTime.minutes
        const endMinute = endTime.hours * 60 + endTime.minutes
        const currentMinute =
            time.timeOfDay24HourNumeric.hours * 60 +
            time.timeOfDay24HourNumeric.minutes +
            // act as though the time is in the middle of the tick, rather than the start
            this.#constants.minutesPerTick / 2

        const scaleFactor = (currentMinute - startMinute) / (endMinute - startMinute)
        const darkness = this.#scaleVector(scaleFactor, fromDarkness, toDarkness)
        this.#setSceneDarkness(darkness)

        console.debug(
            'JD ETime | twilight (dawn/dusk) phase is running from minute %d \
            to minute %d. Currently at minute %d for scaleFactor = %f. \
            Setting darkness level %f',
            startMinute,
            endMinute,
            currentMinute,
            scaleFactor,
            darkness
        )
    }

    #scaleVector (scale, start, end) {
        let v = scale * (end - start) + start
        v = Math.min(1, Math.max(0, v))
        return v
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

        if (split[2].toLocaleUpperCase() === 'PM' && time.hours < 12) time.hours += 12

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
        const totalMinutes = ticks * this.#constants.minutesPerTick + time.hours * 60 + time.minutes
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
        return game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)['animate-darkness-ms']
    }

    get #daytimeDarkness () {
        return game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)['day-darkness-level']
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
            game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)['dawn-start']
        )
    }

    get #dawnDurationTicks () {
        return game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)['dawn-duration-ticks']
    }

    get #duskStart () {
        return this.#parseTimeOfDay(
            game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)['dusk-start']
        )
    }

    get #duskDurationTicks () {
        return game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)['dusk-duration-ticks']
    }
}
