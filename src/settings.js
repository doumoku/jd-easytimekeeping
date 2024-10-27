export { MODULE_ID, SETTINGS, registerSettings }

const MODULE_ID = 'jd-dbtime'
const SETTINGS = {
    SHOW_HOURS: 'showHours',
    SHOW_DAYS: 'showDays',
    TOTAL_ELAPSED_TIME: 'totalElapsedTime',
    BASE_TIME_UNIT: 'baseTimeUnit',
    BASE_TIME_CLOCK: 'baseTimeClock',
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

    game.settings.register(MODULE_ID, SETTINGS.BASE_TIME_UNIT, {
        name: game.i18n.localize('DBTIME.Settings.BaseTimeUnit.name'),
        hint: game.i18n.localize('DBTIME.Settings.BaseTimeUnit.hint'),
        scope: 'world',
        config: true,
        type: new foundry.data.fields.StringField({
            choices: {
                5: '5 minutes',
                10: '10 minutes',
                15: '15 minutes',
                20: '20 minutes',
                30: '30 minutes',
            },
        }),
        default: 15,
        onChange: value => {
            // TODO: validation is needed!
            console.log('DB Time | %s %d', SETTINGS.BASE_TIME_UNIT, value)
        },
        requiresReload: true,
    })

    game.settings.register(MODULE_ID, SETTINGS.BASE_TIME_CLOCK, {
        name: game.i18n.localize('DBTIME.Settings.BaseTimeClock.name'),
        hint: game.i18n.localize('DBTIME.Settings.BaseTimeClock.hint'),
        scope: 'world',
        config: true,
        type: String,
        default: 'Stretch',
        onChange: value => {
            console.log('DB Time | %s %d', SETTINGS.BASE_TIME_CLOCK, value)
        },
        requiresReload: true,
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
