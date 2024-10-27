/**
 * Dragonbane Timekeeping module registration functions
 *
 */
import { registerSettings, MODULE_ID, SETTINGS } from './settings.js'
import { Constants } from './constants.js'
import { Timekeeper } from './timekeeper.js'

Hooks.once('init', () => {
    console.group('DB Time | init')
    registerSettings()
    console.groupEnd()
})

Hooks.once('setup', () => {
    /**
     * I probably want to create the clocks and setup the API here, since I need
     * Global Progress Clocks to be initialised first, and that happens in the init hook.
     */
    console.group('DB Time | setup')
    const constants = new Constants(game.settings.get(MODULE_ID, SETTINGS.BASE_TIME_UNIT))
    game.modules.get('jd-dbtime').api = new Timekeeper(constants)

    console.groupEnd()
})

// Hooks.once('ready', () => {
// })
