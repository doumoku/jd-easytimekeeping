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

    const uiPanel = new UIPanel()
    uiPanel.init()
    game.modules.get(MODULE_ID).uiPanel = uiPanel

    DaylightCycle.init()

    console.groupEnd()
})

Hooks.once('ready', async () => {
    console.group('JD ETime | ready')

    const clockView = new ClockView()
    clockView.init()

    const timekeeper = new Timekeeper(clockView)
    timekeeper.init()

    game.modules.get(MODULE_ID).api = timekeeper
    game.modules.get(MODULE_ID).constants = Constants

    console.groupEnd()
})

Hooks.on('canvasReady', () => {
    game.modules.get(MODULE_ID).uiPanel.render(true)
})
