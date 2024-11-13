export { MODULE_ID, SETTINGS, registerSettings }

import { registerAutoTellTimeSettings } from './autotelltimesettings.mjs'
import { registerDaylightCycleSettings } from './daylightcyclesettings.mjs'

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
    DISPLAY_24_HOUR_TIME: 'display24HourTime',
    SMALL_TIME_DELTA: 'smallTimeDelta',
    LARGE_TIME_DELTA: 'largeTimeDelta',
}

function registerSettings () {
    // Register the menus
    registerAutoTellTimeSettings()
    registerDaylightCycleSettings()

    // TODO: I might want a show time setting later when it comes to the UI - do the players see the time on the UI or not?
    // game.settings.register(MODULE_ID, SETTINGS.SHOW_HOURS, {
    //     name: game.i18n.localize('JDTIMEKEEPING.Settings.ShowHours.name'),
    //     hint: game.i18n.localize('JDTIMEKEEPING.Settings.ShowHours.hint'),
    //     scope: 'world',
    //     config: true,
    //     type: Boolean,
    //     default: false,
    //     onChange: value => {
    //         console.log('JD ETime | %s %o', SETTINGS.SHOW_HOURS, value)
    //     },
    //     requiresReload: true,
    //     restricted: true,
    // })

    // TODO: for later - does the count of days get shown on the panel?
    // game.settings.register(MODULE_ID, SETTINGS.SHOW_DAYS, {
    //     name: game.i18n.localize('JDTIMEKEEPING.Settings.ShowDays.name'),
    //     hint: game.i18n.localize('JDTIMEKEEPING.Settings.ShowDays.hint'),
    //     scope: 'world',
    //     config: true,
    //     type: Boolean,
    //     default: false,
    //     onChange: value => {
    //         console.log('JD ETime | %s %o', SETTINGS.SHOW_DAYS, value)
    //     },
    //     requiresReload: true,
    //     restricted: true,
    // })

    game.settings.register(MODULE_ID, SETTINGS.DISPLAY_24_HOUR_TIME, {
        name: game.i18n.localize('JDTIMEKEEPING.Settings.Display24HourFormat.name'),
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        requiresReload: false,
        restricted: true,
    })

    // small time delta in minutes
    game.settings.register(MODULE_ID, SETTINGS.SMALL_TIME_DELTA, {
        name: 'JDTIMEKEEPING.Settings.SmallTimeDelta.name',
        hint: 'JDTIMEKEEPING.Settings.SmallTimeDelta.hint',
        scope: 'world',
        config: true,
        type: new foundry.data.fields.StringField({
            choices: {
                5: '5',
                10: '10',
                15: '15',
                20: '20',
                30: '30',
            },
            required: true,
        }),
        default: 15,
        onChange: value => {
            console.log('JD ETime | %s %d', SETTINGS.SMALL_TIME_DELTA, value)
        },
        requiresReload: false,
        restricted: true,
    })

    // Large time delta in hours
    game.settings.register(MODULE_ID, SETTINGS.LARGE_TIME_DELTA, {
        name: 'JDTIMEKEEPING.Settings.LargeTimeDelta.name',
        hint: 'JDTIMEKEEPING.Settings.LargeTimeDelta.hint',
        scope: 'world',
        config: true,
        type: new foundry.data.fields.StringField({
            choices: {
                1: '1',
                2: '2',
                3: '3',
                4: '4',
                5: '5',
                6: '6',
                12: '12',
            },
            required: true,
        }),
        default: 6,
        onChange: value => {
            console.log('JD ETime | %s %d', SETTINGS.LARGE_TIME_DELTA, value)
        },
        requiresReload: false,
        restricted: true,
    })

    /*
    game.settings.register(MODULE_ID, SETTINGS.BASE_TIME_CLOCK, {
        name: game.i18n.localize('JDTIMEKEEPING.Settings.BaseTimeClock.name'),
        hint: game.i18n.localize('JDTIMEKEEPING.Settings.BaseTimeClock.hint'),
        scope: 'world',
        config: true,
        type: String,
        default: 'Stretch',
        onChange: value => {
            console.log('JD ETime | %s %d', SETTINGS.BASE_TIME_CLOCK, value)
        },
        requiresReload: true,
        restricted: true,
    })
    */

    game.settings.register(MODULE_ID, SETTINGS.TIME_CHANGE_MACRO, {
        name: game.i18n.localize('JDTIMEKEEPING.Settings.TimeChangeMacro.name'),
        hint: game.i18n.localize('JDTIMEKEEPING.Settings.TimeChangeMacro.hint'),
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
