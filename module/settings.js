const MODULE_ID = 'jd-dbtime'

export { MODULE_ID, SETTINGS, registerSettings }

const SETTINGS = {
    SHOW_HOURS: 'showHours',
    SHOW_DAYS: 'showDays',
}

function registerSettings () {
    game.settings.register(MODULE_ID, SETTINGS.SHOW_HOURS, {
        name: 'Show Hours',
        hint: 'Should the hour clock be shown?',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        onChange: value => {
            console.log('DB Time: %s %o', SETTINGS.SHOW_HOURS, value)
        },
        // FIXME: this is for testing. It will actually require a reload since I'll need to mix up the clock configuration
        requiresReload: false,
    })

    game.settings.register(MODULE_ID, SETTINGS.SHOW_DAYS, {
        name: 'Show Days',
        hint: 'Should the day clock be shown?',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        onChange: value => {
            console.log('DB Time: %s %o', SETTINGS.SHOW_DAYS, value)
        },
        // FIXME: this is for testing. It will actually require a reload since I'll need to mix up the clock configuration
        requiresReload: false,
    })
}
