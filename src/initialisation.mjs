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

    /**
     * This creates a DOM element in the ui-left interface div,
     * in between the canvas controls and the players panel.
     * */
    createUIPanelElement('#controls')

    game.modules.get(MODULE_ID).uiPanel = new UIPanel()
    game.modules.get(MODULE_ID).uiPanel.init()
    console.groupEnd()
})

// Create a DOM element somewhere in the page. Technique from Global Progress Clocks
function createUIPanelElement (insertAfter = '#ui-top') {
    const top = document.querySelector(insertAfter)
    if (top) {
        const template = document.createElement('template')
        template.setAttribute('id', UIPanel.ID)
        top.insertAdjacentElement('afterend', template)
    }
}

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
