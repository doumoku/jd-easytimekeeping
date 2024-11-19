/**
 * Dragonbane Timekeeping module registration functions
 *
 */
import { registerKeybindings, registerSettings, MODULE_ID } from './settings.mjs'
import { TimeTeller } from './timeteller.mjs'
import { Constants } from './constants.mjs'
import { DaylightCycle } from './daylightcycle.mjs'
import { Timekeeper } from './timekeeper.mjs'
import { UIPanel } from './uipanel.mjs'

Hooks.once('init', () => {
    console.group('JD ETime | init')

    registerKeybindings()

    const uiPanel = new UIPanel()
    uiPanel.init()
    game.modules.get(MODULE_ID).uiPanel = uiPanel

    TimeTeller.init()
    DaylightCycle.init()

    console.groupEnd()
})

Hooks.once('ready', async () => {
    console.group('JD ETime | ready')

    registerSettings()

    const timekeeper = new Timekeeper()
    timekeeper.init()

    game.modules.get(MODULE_ID).api = timekeeper
    game.modules.get(MODULE_ID).timeChangeHookName = Timekeeper.TIME_CHANGE_HOOK
    game.modules.get(MODULE_ID).constants = Constants

    console.groupEnd()
})

Hooks.on('canvasReady', () => {
    game.modules.get(MODULE_ID).uiPanel.render(true)
})
