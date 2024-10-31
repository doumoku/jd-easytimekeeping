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
    }

    #processNight (time) {}

    #processDawn (time) {}

    #processDusk (time) {}
}
