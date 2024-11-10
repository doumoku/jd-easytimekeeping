/**
 * Dragonbane Timekeeping module registration functions
 *
 */
import { registerSettings, MODULE_ID } from './settings.mjs'
import { ClockView } from './clockview.mjs'
import { Constants } from './constants.mjs'
import { DaylightCycle } from './daylightcycle.mjs'
import { Timekeeper } from './timekeeper.mjs'

Hooks.once('init', () => {
    console.group('JD ETime | init')
    registerSettings()
    console.groupEnd()
})

Hooks.once('ready', async () => {
    console.group('JD ETime | ready')

    const clockView = new ClockView()
    clockView.initialise()

    DaylightCycle.init()

    const timekeeper = new Timekeeper(clockView)
    timekeeper.initialise()

    game.modules.get(MODULE_ID).api = timekeeper
    game.modules.get(MODULE_ID).constants = Constants

    console.groupEnd()
})
