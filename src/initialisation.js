/**
 * Dragonbane Timekeeping module registration functions
 *
 */
import { registerSettings, MODULE_ID, SETTINGS } from './settings.js'
import { ClockView } from './clockview.js'
import { Constants } from './constants.js'
import { Timekeeper } from './timekeeper.js'

Hooks.once('init', () => {
    console.group('DB Time | init')
    registerSettings()
    console.groupEnd()
})

// Hooks.once('setup', () => {
// })

Hooks.once('ready', () => {
    console.group('DB Time | ready')
    const baseTimeUnit = Number.parseInt(
        game.settings.get(MODULE_ID, SETTINGS.BASE_TIME_UNIT)
    )
    const constants = new Constants(baseTimeUnit)
    const clockView = new ClockView(constants)
    game.modules.get('jd-dbtime').api = new Timekeeper(constants, clockView)
    console.groupEnd()
})
