/**
 * module registration functions
 *
 * Version 1.0
 */
import { registerSettings } from './settings.js'

Hooks.once('init', () => {
    registerSettings()
})

Hooks.once('setup', () => {
    /**
     * I probably want to create the clocks and setup the API here, since I need
     * Global Progress Clocks to be initialised first, and that happens in the init hook.
     */
    console.log('dbtime setup')

    // game.modules.get('jd-dbtime').api = tick
})

// Hooks.once('ready', () => {
// })
