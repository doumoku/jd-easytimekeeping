/**
 * Defines the constants which are used in multiple places for time calculations.
 */

export class Constants {
    constructor () {
        this.minutesPerDay = 60 * 24
        this.shiftsPerDay = 4
        this.hoursPerShift = 6
        this.hoursPerDay = 24
        this.minutesPerShift = 60 * 6  // 6 hours * 60 minutes per hour
    }
}
