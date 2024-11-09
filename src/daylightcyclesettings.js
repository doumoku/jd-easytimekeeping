import { MODULE_ID, SETTINGS } from './settings.js'

export function registerDaylightCycleSettings () {
    // The settings menu
    game.settings.registerMenu(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_MENU, {
        name: game.i18n.localize('JDTIMEKEEPING.Settings.DaylightCycleSettings.name'),
        label: game.i18n.localize('JDTIMEKEEPING.Settings.DaylightCycleSettings.label'),
        hint: game.i18n.localize('JDTIMEKEEPING.Settings.DaylightCycleSettings.hint'),
        icon: 'fas fa-cog',
        type: DaylightCycleMenu,
        restricted: true,
    })

    // the settings object
    game.settings.register(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS, {
        scope: 'world',
        config: false,
        type: Object,
        default: {
            'daylight-cycle-enabled': false,
            'day-darkness-level': 0,
            'night-darkness-level': 1.0,
            'dusk-start': '6:00 PM',
            'dawn-start': '6:00 AM',
            'dawn-duration-ticks': 4,
            'dusk-duration-ticks': 4,
            'animate-darkness-ms': 5000,
        },
    })
}

class DaylightCycleMenu extends FormApplication {
    static get defaultOptions () {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ['settings'],
            popOut: true,
            width: 500,
            template: `modules/${MODULE_ID}/templates/daylightcyclesettings.hbs`,
            id: SETTINGS.DAYLIGHT_CYCLE_MENU,
            title: game.i18n.localize('JDTIMEKEEPING.Settings.DaylightCycleSettings.name'),
        })
    }

    getData () {
        const initialValues = game.settings.get(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS)

        // TODO: I could do better than this fixed choice of options for
        // starting dusk and sunrise, but it's good enough for now
        const duskOptions = {
            '4:30 PM': false,
            '5:00 PM': false,
            '5:30 PM': false,
            '6:00 PM': false,
            '6:30 PM': false,
            '7:00 PM': false,
        }

        const dawnOptions = {
            '4:30 AM': false,
            '5:00 AM': false,
            '5:30 AM': false,
            '6:00 AM': false,
            '6:30 AM': false,
            '7:00 AM': false,
        }

        // set the initial values for the form
        duskOptions[initialValues['dusk-start']] = true
        dawnOptions[initialValues['dawn-start']] = true
        initialValues['dusk-start-options'] = duskOptions
        initialValues['dawn-start-options'] = dawnOptions
        initialValues['animate-darkness'] = initialValues['animate-darkness-ms'] / 1000

        /**
         * There's no neat way to give this settings form application access
         * to the Constants instance, so lets just grab it from the public API
         */
        initialValues['tick-minutes'] = game.modules.get(MODULE_ID).api.constants.minutesPerTick
        console.debug(initialValues)
        return initialValues
    }

    _updateObject (event, formData) {
        // gets data from the form, validates and persists if valid
        const data = foundry.utils.expandObject(formData)
        data['animate-darkness-ms'] = Number.parseFloat(data['animate-darkness']) * 1000
        console.debug('JD ETime | DaylightCycleMenu _updateObject: %o', data)
        game.settings.set(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS, data)
    }
}
