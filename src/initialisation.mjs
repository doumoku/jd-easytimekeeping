/**
 * Dragonbane Timekeeping module registration functions
 *
 */
import { registerSettings, MODULE_ID } from './settings.mjs'
import { ClockView } from './clockview.mjs'
import { Constants } from './constants.mjs'
import { DaylightCycle } from './daylightcycle.mjs'
import { Timekeeper } from './timekeeper.mjs'
import { UIPanel } from './uipanel.mjs'

Hooks.once('init', () => {
    console.group('JD ETime | init')
    registerSettings()
    game.modules.get(MODULE_ID).uiPanel = new UIPanel()
    game.modules.get(MODULE_ID).uiPanel.init()
    console.groupEnd()
})

Hooks.once('ready', async () => {
    console.group('JD ETime | ready')

    DaylightCycle.init()

    const clockView = new ClockView()
    clockView.initialise()

    const timekeeper = new Timekeeper(clockView)
    timekeeper.initialise()

    game.modules.get(MODULE_ID).api = timekeeper
    game.modules.get(MODULE_ID).constants = Constants

    console.groupEnd()
})

Hooks.on('canvasReady', () => {
    game.modules.get(MODULE_ID).uiPanel.render(true)
})
