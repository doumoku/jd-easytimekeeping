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
        // TODO: when this was a script, it only ran for the GM. Now it's a module, do I need to manually ensure it only runs for the GM?

        if (!this.#enabled) return

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
    }

    #detectPhase (time) {
        return PHASES.DAY
    }

    #processDay (time) {
        console.debug('DB Time | Daylight cycle - processing daytime phase')
        if (this.#sceneDarkness != this.#daytimeDarkness) {
            console.log(
                'DB Time | Daylight cycle: setting daytime darkness %f',
                this.#daytimeDarkness
            )
            this.#setSceneDarkness(this.#daytimeDarkness)
        }
    }

    #processNight (time) {
        console.debug('DB Time | Daylight cycle - processing night phase')
        if (this.#sceneDarkness != this.#nighttimeDarkness) {
            console.log(
                'DB Time | Daylight cycle: setting nighttime darkness %f',
                this.#nighttimeDarkness
            )
            this.#setSceneDarkness(this.#nighttimeDarkness)
        }
    }

    #processDawn (time) {
        console.debug('DB Time | Daylight cycle - processing dawn phase')
    }

    #processDusk (time) {
        console.debug('DB Time | Daylight cycle - processing dusk phase')
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
}
