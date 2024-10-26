Hooks.once('init', () => {
    // registerSettings();
    // console.log('dbtime init')
})

Hooks.once('setup', () => {
    /**
     * I probably want to create the clocks and setup the API here, since I need
     * Global Progress Clocks to be initialised first, and that happens in the init hook.
     */
    // console.log('dbtime setup')
    // TODO: Something like this
    // game.modules.get('jd-dbtime').api = new DBTimeAPI()
})

Hooks.once('ready', () => {
    // console.log('dbtime ready')
})
