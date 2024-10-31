/**
 * Encapsulates the Clock view for Dragonbane Timekeeping
 */
import { MODULE_ID, SETTINGS } from './settings.js'

export class DaylightCycle {
    #constants = null

    constructor (constants) {
        this.#constants = constants
    }

    initialise () {
        // console.debug('DB Time | DaylightCycle initialising')
    }

    updateTime (time) {
        // TODO: when this was a script, it only ran for the GM. Now it's a module, do I need to manually ensure it only runs for the GM?
    }
}
