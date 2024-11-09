export { MODULE_ID, SETTINGS, registerSettings }

import { registerAutoTellTimeSettings } from './autotelltimemenu.js'
import { registerDaylightCycleSettings } from './daylightcyclesettings.js'

const MODULE_ID = 'jd-easytimekeeping'
const SETTINGS = {
    SHOW_HOURS: 'showHours',
    SHOW_DAYS: 'showDays',
    TOTAL_ELAPSED_MINUTES: 'totalElapsedMinutes',
    TIME_CHANGE_MACRO: 'timeChangeMacro',
    AUTO_TELL_TIME_SETTINGS: 'autoTellTimeSettings',
    AUTO_TELL_TIME_MENU: 'autoTellTimeMenu',
    DAYLIGHT_CYCLE_SETTINGS: 'daylightCycleSettings',
    DAYLIGHT_CYCLE_MENU: 'daylightCycleMenu',
}

function registerSettings () {
    // Register the menus
    registerAutoTellTimeSettings()
    registerDaylightCycleSettings()

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

    /*
    game.settings.register(MODULE_ID, SETTINGS.BASE_TIME_UNIT, {
        name: game.i18n.localize('DBTIME.Settings.BaseTimeUnit.name'),
        hint: game.i18n.localize('DBTIME.Settings.BaseTimeUnit.hint'),
        scope: 'world',
        config: true,
        type: new foundry.data.fields.StringField({
            choices: {
                5: game.i18n.localize('DBTIME.Settings.BaseTimeUnit.option.5'),
                10: game.i18n.localize('DBTIME.Settings.BaseTimeUnit.option.10'),
                15: game.i18n.localize('DBTIME.Settings.BaseTimeUnit.option.15'),
                20: game.i18n.localize('DBTIME.Settings.BaseTimeUnit.option.20'),
                30: game.i18n.localize('DBTIME.Settings.BaseTimeUnit.option.30'),
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
    */

    game.settings.register(MODULE_ID, SETTINGS.TIME_CHANGE_MACRO, {
        name: game.i18n.localize('DBTIME.Settings.TimeChangeMacro.name'),
        hint: game.i18n.localize('DBTIME.Settings.TimeChangeMacro.hint'),
        scope: 'world',
        config: true,
        type: new foundry.data.fields.DocumentUUIDField({ type: 'Macro' }),
        requiresReload: false,
        restricted: true,
    })

    game.settings.register(MODULE_ID, SETTINGS.TOTAL_ELAPSED_MINUTES, {
        scope: 'world',
        config: false,
        type: Number,
        default: 0,
        requiresReload: false,
        restricted: true,
    })
}
