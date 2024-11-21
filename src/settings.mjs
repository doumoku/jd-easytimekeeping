import { registerAutoTellTimeSettings } from './autotelltimesettings.mjs'
import { registerDaylightCycleSettings } from './daylightcyclesettings.mjs'
import { registerShiftSettings } from './shiftsettings.mjs'

export const MODULE_ID = 'jd-easytimekeeping'
export const SETTINGS = {
    TOTAL_ELAPSED_MINUTES: 'totalElapsedMinutes',
    TIME_CHANGE_MACRO: 'timeChangeMacro',
    AUTO_TELL_TIME_SETTINGS: 'autoTellTimeSettings',
    AUTO_TELL_TIME_MENU: 'autoTellTimeMenu',
    DAYLIGHT_CYCLE_SETTINGS: 'daylightCycleSettings',
    DAYLIGHT_CYCLE_MENU: 'daylightCycleMenu',
    SHIFT_SETTINGS: 'shiftSettings',
    SHIFT_MENU: 'shiftMenu',
    DISPLAY_24_HOUR_TIME: 'display24HourTime',
    SMALL_TIME_DELTA: 'smallTimeDelta',
    LARGE_TIME_DELTA: 'largeTimeDelta',
    SHOW_RADIAL_CLOCK: 'showRadialClock',
    SHOW_DRAGONBANE_TIME: 'showDragonbaneTime',
    SHOW_PLAYERS_EXACT_TIME: 'showPlayersExactTime',
    UI_TEXT_COLOR: 'uiTextColor',
    RADIAL_CLOCK_COLOR: 'radialClockColor',
    UI_FADE_OPACITY: 'uiFadeOpacity',
}

export function registerSettings () {
    // Register the menus
    registerAutoTellTimeSettings()
    registerDaylightCycleSettings()
    registerShiftSettings()

    game.settings.register(MODULE_ID, SETTINGS.SHOW_PLAYERS_EXACT_TIME, {
        name: 'JDTIMEKEEPING.Settings.ShowPlayersExactTime.name',
        hint: 'JDTIMEKEEPING.Settings.ShowPlayersExactTime.hint',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        requiresReload: true,
        restricted: true,
    })

    game.settings.register(MODULE_ID, SETTINGS.DISPLAY_24_HOUR_TIME, {
        name: game.i18n.localize('JDTIMEKEEPING.Settings.Display24HourFormat.name'),
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        requiresReload: true,
        restricted: true,
    })

    game.settings.register(MODULE_ID, SETTINGS.SHOW_DRAGONBANE_TIME, {
        name: 'JDTIMEKEEPING.Settings.ShowDragonbaneTime.name',
        hint: 'JDTIMEKEEPING.Settings.ShowDragonbaneTime.hint',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        requiresReload: true,
        restricted: true,
    })

    game.settings.register(MODULE_ID, SETTINGS.SHOW_RADIAL_CLOCK, {
        name: 'JDTIMEKEEPING.Settings.ShowRadialClock.name',
        hint: 'JDTIMEKEEPING.Settings.ShowRadialClock.hint',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        requiresReload: true,
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

    game.settings.register(MODULE_ID, SETTINGS.TIME_CHANGE_MACRO, {
        name: game.i18n.localize('JDTIMEKEEPING.Settings.TimeChangeMacro.name'),
        hint: game.i18n.localize('JDTIMEKEEPING.Settings.TimeChangeMacro.hint'),
        scope: 'world',
        config: true,
        type: new foundry.data.fields.DocumentUUIDField({ type: 'Macro' }),
        requiresReload: false,
        restricted: true,
    })

    game.settings.register(MODULE_ID, SETTINGS.UI_TEXT_COLOR, {
        name: 'JDTIMEKEEPING.Settings.UITextColor.name',
        hint: 'JDTIMEKEEPING.Settings.UITextColor.hint',
        scope: 'client',
        config: true,
        type: new foundry.data.fields.ColorField(),
        default: '#ffffff',
        requiresReload: true,
        restricted: false,
    })

    game.settings.register(MODULE_ID, SETTINGS.RADIAL_CLOCK_COLOR, {
        name: 'JDTIMEKEEPING.Settings.RadialClockColor.name',
        hint: 'JDTIMEKEEPING.Settings.RadialClockColor.hint',
        scope: 'client',
        config: true,
        type: new foundry.data.fields.ColorField(),
        default: '#138b37',
        requiresReload: true,
        restricted: false,
    })

    game.settings.register(MODULE_ID, SETTINGS.UI_FADE_OPACITY, {
        name: 'JDTIMEKEEPING.Settings.UIFadeOpacity.name',
        hint: 'JDTIMEKEEPING.Settings.UIFadeOpacity.hint',
        scope: 'client',
        config: true,
        type: new foundry.data.fields.NumberField({ min: 0, max: 1.0 }),
        default: 0.8,
        requiresReload: true,
        restricted: false,
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

export function registerKeybindings () {
    // Define keybindings for time operations but leave them unbound

    // small increment
    game.keybindings.register(MODULE_ID, 'small-increment', {
        name: 'JDTIMEKEEPING.SmallIncrement',
        precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY,
        restricted: true,
        onDown: () => {
            game.modules.get(MODULE_ID).api?.increment({
                minutes: game.settings.get(MODULE_ID, SETTINGS.SMALL_TIME_DELTA),
            })
            return true
        },
    })

    // small decrement
    game.keybindings.register(MODULE_ID, 'small-decrement', {
        name: 'JDTIMEKEEPING.SmallDecrement',
        precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY,
        restricted: true,
        onDown: () => {
            game.modules.get(MODULE_ID).api?.increment({
                minutes: -game.settings.get(MODULE_ID, SETTINGS.SMALL_TIME_DELTA),
            })
            return true
        },
    })

    // large increment
    game.keybindings.register(MODULE_ID, 'large-increment', {
        name: 'JDTIMEKEEPING.LargeIncrement',
        precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY,
        restricted: true,
        onDown: () => {
            game.modules.get(MODULE_ID).api?.increment({
                hours: game.settings.get(MODULE_ID, SETTINGS.LARGE_TIME_DELTA),
            })
            return true
        },
    })

    // large decrement
    game.keybindings.register(MODULE_ID, 'large-decrement', {
        name: 'JDTIMEKEEPING.LargeDecrement',
        precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY,
        restricted: true,
        onDown: () => {
            game.modules.get(MODULE_ID).api?.increment({
                hours: -game.settings.get(MODULE_ID, SETTINGS.LARGE_TIME_DELTA),
            })
            return true
        },
    })
}
