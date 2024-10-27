/**
 * Encapsulates the Clock view for Dragonbane Timekeeping
 */

export class ClockView {
    #constants = null

    constructor (constants) {
        console.debug('DB Time | ClockView Checking for Clocks')
        this.#constants = constants
        /* TODO: check for the Global Progress Clocks,
         validate them if present or make them if missing
        */
    }
}
