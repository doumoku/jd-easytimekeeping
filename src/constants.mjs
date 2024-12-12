/**
 */
import { MODULE_ID, SETTINGS } from './settings.mjs'

/**
 * Constants used in time calculations.
 * 
 * @property {Number} secondsPerDay The number of seconds in a day.
 * @property {Number} minutesPerDay The number of minutes in a day.
 * @property {Number} hoursPerDay The number of hours in a day.
 * @property {Number} shiftsPerDay The number of shifts in a day.
 * @property {Number} minutesPerShift The number of minutes in a shift.
 * @property {Number} hoursPerShift The number of hours in a shift.
 * @property {Number} daysPerWeek The number of days in a week.
 * @property {Number} minutesPerTurn The number of minutes in a game turn. Will vary by current module settings.
 * @property {Number} turnsPerShift The number of game turns per shift. Will vary by current module settings.
 * @property {Number} turnsPerDay The number of game turns per day. Will vary by current module settings.
 * 
 * @public
 */
export class Constants {
    static secondsPerDay = 24 * 60 * 60
    static minutesPerDay = 24 * 60
    static hoursPerDay = 24
    static shiftsPerDay = 4
    static minutesPerShift = 6 * 60 // hoursPerShift * minutesPerHour
    static hoursPerShift = 6
    static daysPerWeek = 7

    static get minutesPerTurn () {
        return game.settings.get(MODULE_ID, SETTINGS.SMALL_TIME_DELTA)
    }

    static get turnsPerShift () {
        return Constants.minutesPerShift / Constants.minutesPerTurn
    }

    static get turnsPerDay () {
        return Constants.turnsPerShift * Constants.shiftsPerDay
    }
}
