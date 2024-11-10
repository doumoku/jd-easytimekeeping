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
import { Timekeeper } from './timekeeper.mjs'

const PHASES = {
    DAWN: 0,
    DAY: 1,
    DUSK: 2,
    NIGHT: 3,
}

export class DaylightCycle {

    constructor () {
        Hooks.on(Timekeeper.TIME_CHANGE_HOOK, this.timeChangeHandler.bind(this))
    }

    timeChangeHandler (data) {
        const time = data.time
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

    #detectPhase (time) {
        /**
         * Internally, work with the JS Date object since it's much
         * less error prone and will handle all the edge cases for us
         */
        const dawnStart = this.#asDate(this.#dawnStart)
        const dawnEnd = new Date(dawnStart)
        dawnEnd.setMinutes(dawnEnd.getMinutes() + this.#dawnDuration)

        const duskStart = this.#asDate(this.#duskStart)
        const duskEnd = new Date(duskStart)
        duskEnd.setMinutes(duskEnd.getMinutes() + this.#duskDuration)

        // Create now from dawnStart so that it will be on the same day,
        // but with the same hours & minutes as the in-game time
        const now = new Date(dawnStart)
        now.setHours(time.hours)
        now.setMinutes(time.minutes, 0, 0)

        /**
         * to avoid messing with the time roll-over at midnight, test for dawn,
         * day and dusk. It's night when it's not one of those three.
         */
        if (now >= dawnStart && now < dawnEnd) {
            return PHASES.DAWN
        } else if (now >= dawnEnd && now < duskStart) {
            return PHASES.DAY
        } else if (now >= duskStart && now < duskEnd) {
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
            this.#dawnDuration,
            this.#nighttimeDarkness,
            this.#daytimeDarkness
        )
    }

    #processDusk (time) {
        console.debug('JD ETime | Daylight cycle - dusk')
        this.#processTwilightPhase(
            time,
            this.#duskStart,
            this.#duskDuration,
            this.#daytimeDarkness,
            this.#nighttimeDarkness
        )
    }

    #processTwilightPhase (time, startTime, durationMinutes, fromDarkness, toDarkness) {
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
        const endTime = this.#addMinutes(startTime, durationMinutes)
        const startMinute = startTime.hours * 60 + startTime.minutes
        const endMinute = endTime.hours * 60 + endTime.minutes
        const currentMinute = time.hours * 60 + time.minutes
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
     * @param {Date} time the time
     * @param {Number} minutes the number of minutes to add to the time
     */
    #addMinutes (time, minutes) {
        const totalMinutes = time.hours * 60 + time.minutes + minutes
        return {
            hours: Math.floor(totalMinutes / 60),
            minutes: totalMinutes % 60,
        }
    }

    /**
     * Gets a JS Date object corresponding to the time.
     * Note that the represented real time is arbitrary
     * and is based on the current time and date.
     * This doesn't matter, since we never output this real date to the user
     * and we only use these objects to simplify relative calculations between times
     * and to ensure correct detection of daylight cycle phases when the phases cross
     * the midnight boundary.
     * @param {Object} time
     * @param {Number} time.days
     * @param {Number} time.hours
     * @param {Number} time.minutes
     * @returns
     */
    #asDate (time) {
        const date = new Date()
        date.setDate(time.days)
        date.setHours(time.hours)
        date.setMinutes(time.minutes, 0, 0)
        return date
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

    #asTime (s) {
        const split = s.split(':')
        return { days: 1, hours: Number.parseInt(split[0]), minutes: Number.parseInt(split[1]) }
    }

    get #dawnStart () {
        return this.#asTime(
            game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)['dawn-start']
        )
    }

    get #dawnDuration () {
        return game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)['dawn-duration']
    }

    get #duskStart () {
        return this.#asTime(
            game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)['dusk-start']
        )
    }

    get #duskDuration () {
        return game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)['dusk-duration']
    }
}
