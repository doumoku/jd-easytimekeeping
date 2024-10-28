export { MODULE_ID, SETTINGS, registerSettings }

const MODULE_ID = 'jd-dbtime'
const SETTINGS = {
    SHOW_HOURS: 'showHours',
    SHOW_DAYS: 'showDays',
    TOTAL_ELAPSED_TIME: 'totalElapsedTime',
    BASE_TIME_UNIT: 'baseTimeUnit',
    BASE_TIME_CLOCK: 'baseTimeClock',
    STRETCH_CLOCK_ID: 'stretchClockId',
    HOUR_CLOCK_ID: 'HourClockId',
    SHIFT_CLOCK_ID: 'ShiftClockId',
    DAY_CLOCK_ID: 'DayClockId',
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
        requiresReload: true,
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
        requiresReload: true,
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
            required: true,
        }),
        default: 15,
        onChange: value => {
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

    registerId(SETTINGS.STRETCH_CLOCK_ID)
    registerId(SETTINGS.HOUR_CLOCK_ID)
    registerId(SETTINGS.SHIFT_CLOCK_ID)
    registerId(SETTINGS.DAY_CLOCK_ID)
}

function registerId (setting) {
    game.settings.register(MODULE_ID, setting, {
        scope: 'world',
        config: false,
        type: String,
        requiresReload: false,
    })
}
