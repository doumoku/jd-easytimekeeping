/**
 * Dragonbane Timekeeping module registration functions
 *
 */
import { registerSettings } from './settings.js'

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

    // game.modules.get('jd-dbtime').api = tick
    console.groupEnd()
})

// Hooks.once('ready', () => {
// })
