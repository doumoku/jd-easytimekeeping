export { MODULE_ID, SETTINGS, registerSettings }

const MODULE_ID = 'jd-dbtime'
const SETTINGS = {
    SHOW_HOURS: 'showHours',
    SHOW_DAYS: 'showDays',
    TOTAL_ELAPSED_TIME: 'totalElapsedTime',
    BASE_TIME_UNIT: 'baseTimeUnit',
    BASE_TIME_CLOCK: 'baseTimeClock',
    TICK_CLOCK_ID: 'tickClockId',
    HOUR_CLOCK_ID: 'hourClockId',
    SHIFT_CLOCK_ID: 'shiftClockId',
    DAY_CLOCK_ID: 'dayClockId',
    TIME_CHANGE_MACRO: 'timeChangeMacro',
    AUTO_TELL_TIME_SETTINGS: 'autoTellTimeSettings',
    AUTO_TELL_TIME_MENU: 'autoTellTimeSettingsMenu',
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
        restricted: true,
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
        restricted: true,
    })

    game.settings.register(MODULE_ID, SETTINGS.BASE_TIME_UNIT, {
        name: game.i18n.localize('DBTIME.Settings.BaseTimeUnit.name'),
        hint: game.i18n.localize('DBTIME.Settings.BaseTimeUnit.hint'),
        scope: 'world',
        config: true,
        type: new foundry.data.fields.StringField({
            choices: {
                5: game.i18n.localize('DBTIME.Settings.BaseTimeUnit.option.5'),
                10: game.i18n.localize(
                    'DBTIME.Settings.BaseTimeUnit.option.10'
                ),
                15: game.i18n.localize(
                    'DBTIME.Settings.BaseTimeUnit.option.15'
                ),
                20: game.i18n.localize(
                    'DBTIME.Settings.BaseTimeUnit.option.20'
                ),
                30: game.i18n.localize(
                    'DBTIME.Settings.BaseTimeUnit.option.30'
                ),
            },
            required: true,
        }),
        default: 15,
        onChange: value => {
            console.log('DB Time | %s %d', SETTINGS.BASE_TIME_UNIT, value)
        },
        requiresReload: true,
        restricted: true,
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
        restricted: true,
    })

    registerAutoTellTimeSettings()

    game.settings.register(MODULE_ID, SETTINGS.TIME_CHANGE_MACRO, {
        name: game.i18n.localize('DBTIME.Settings.TimeChangeMacro.name'),
        hint: game.i18n.localize('DBTIME.Settings.TimeChangeMacro.hint'),
        scope: 'world',
        config: true,
        type: new foundry.data.fields.DocumentUUIDField({ type: 'Macro' }),
        requiresReload: false,
        restricted: true,
    })

    game.settings.register(MODULE_ID, SETTINGS.TOTAL_ELAPSED_TIME, {
        scope: 'world',
        config: false,
        type: Number,
        default: 0,
        requiresReload: false,
    })

    registerId(SETTINGS.TICK_CLOCK_ID)
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

function registerAutoTellTimeSettings () {
    // The settings menu
    game.settings.registerMenu(MODULE_ID, SETTINGS.AUTO_TELL_TIME_MENU, {
        name: game.i18n.localize('DBTIME.Settings.AutoTellTimeConfig.name'),
        label: game.i18n.localize('DBTIME.Settings.AutoTellTimeConfig.label'),
        hint: game.i18n.localize('DBTIME.Settings.AutoTellTimeConfig.hint'),
        icon: 'fas fa-cog',
        type: AutoTellTimeMenu,
        restricted: true,
    })

    // the settings object
    game.settings.register(MODULE_ID, SETTINGS.AUTO_TELL_TIME_SETTINGS, {
        scope: 'world',
        config: false,
        type: Object,
        default: {},
    })
}

class AutoTellTimeMenu extends FormApplication {
    static get defaultOptions () {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ['settings'],
            popOut: true,
            width: 600,
            template: 'modules/jd-dbtime/templates/autotelltimesettings.hbs',
            id: SETTINGS.AUTO_TELL_TIME_MENU,
            title: game.i18n.localize(
                'DBTIME.Settings.AutoTellTimeConfig.name'
            ),
        })
    }

    getData () {
        const initialValues = game.settings.get(
            MODULE_ID,
            SETTINGS.AUTO_TELL_TIME_SETTINGS
        )

        function buildShiftValues (hourArray, amPM) {
            let shiftArray = {}
            for (const h of hourArray) {
                const hour = `${h}:00 ${amPM}`
                shiftArray[hour] = initialValues[hour]
            }

            return shiftArray
        }

        const shiftTimes = {
            morning: buildShiftValues([6, 7, 8, 9, 10, 11], 'AM'),
            afternoon: buildShiftValues([12, 1, 2, 3, 4, 5], 'PM'),
            evening: buildShiftValues([6, 7, 8, 9, 10, 11], 'PM'),
            night: buildShiftValues([12, 1, 2, 3, 4, 5], 'AM'),
        }

        console.log(initialValues)
        console.log(shiftTimes)
        return shiftTimes
    }

    _updateObject (event, formData) {
        // gets data from the form, validates and persists if valid
        const data = foundry.utils.expandObject(formData)
        console.log('DB Time | AutoTell Setting Menu _updateObject: %o', data)
        game.settings.set(MODULE_ID, SETTINGS.AUTO_TELL_TIME_SETTINGS, data)
    }
}
