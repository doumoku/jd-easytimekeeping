/**
 * Defines the constants which are used in multiple places for time calculations.
 */

export class Constants {
    constructor (stretchDurationMinutes) {
        console.assert(
            60 % stretchDurationMinutes === 0,
            'stretchDurationMinutes must evenly subdivide an hour'
        )
        this.minutesPerStretch = stretchDurationMinutes
        this.minutesPerDay = 1440
        this.shiftsPerDay = 4
        this.hoursPerShift = 6
        this.maxDaysTracked = 128 // while we could track more, this is a limitation from GPC
        this.hoursPerDay = 24
        this.stretchesPerHour = Math.floor(60 / stretchDurationMinutes)
        this.stretchesPerShift = this.stretchesPerHour * this.hoursPerShift
        this.stretchesPerDay = this.stretchesPerShift * this.shiftsPerDay
    }
}
