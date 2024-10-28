/**
 * Defines the constants which are used in multiple places for time calculations.
 */

export class Constants {
    constructor (tickDurationMinutes) {
        console.assert(
            60 % tickDurationMinutes === 0,
            'tickDurationMinutes must evenly subdivide an hour'
        )
        this.minutesPerTick = tickDurationMinutes
        this.minutesPerDay = 1440
        this.shiftsPerDay = 4
        this.hoursPerShift = 6
        this.maxDaysTracked = 128 // while we could track more, this is a limitation from GPC
        this.hoursPerDay = 24
        this.ticksPerHour = Math.floor(60 / tickDurationMinutes)
        this.ticksPerShift = this.ticksPerHour * this.hoursPerShift
        this.ticksPerDay = this.ticksPerShift * this.shiftsPerDay
    }
}
