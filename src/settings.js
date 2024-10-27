export { MODULE_ID, SETTINGS, registerSettings }

const MODULE_ID = 'jd-dbtime'
const SETTINGS = {
    SHOW_HOURS: 'showHours',
    SHOW_DAYS: 'showDays',
    TOTAL_ELAPSED_TIME: 'totalElapsedTime',
}

function registerSettings () {
    game.settings.register(MODULE_ID, SETTINGS.SHOW_HOURS, {
        name: game.i18n.localize('DBTIME.Settings.ShowHours.name'),
        hint: game.i18n.localize('DBTIME.Settings.ShowHours.hint'),
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        onChange: value => {
            console.log('DB Time | %s %o', SETTINGS.SHOW_HOURS, value)
        },
        // FIXME: this is for testing. It will actually require a reload since I'll need to mix up the clock configuration
        requiresReload: false,
    })

    game.settings.register(MODULE_ID, SETTINGS.SHOW_DAYS, {
        name: game.i18n.localize('DBTIME.Settings.ShowDays.name'),
        hint: game.i18n.localize('DBTIME.Settings.ShowDays.hint'),
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        onChange: value => {
            console.log('DB Time | %s %o', SETTINGS.SHOW_DAYS, value)
        },
        // FIXME: this is for testing. It will actually require a reload since I'll need to mix up the clock configuration
        requiresReload: false,
    })

    game.settings.register(MODULE_ID, SETTINGS.TOTAL_ELAPSED_TIME, {
        name: 'Total Elapsed Time',
        scope: 'world',
        config: false,
        type: Number,
        default: 0,
        onChange: value => {
            console.log(
                'DB Time | %s=%d ticks',
                SETTINGS.TOTAL_ELAPSED_TIME,
                value
            )
        },
        requiresReload: false,
    })
}
