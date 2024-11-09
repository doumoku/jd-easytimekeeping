import { MODULE_ID, SETTINGS } from './settings.mjs'

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
            'dusk-start': '18:00',
            'dusk-duration': 60,
            'dawn-start': '06:00',
            'dawn-duration': 60,
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
        initialValues['animate-darkness'] = initialValues['animate-darkness-ms'] / 1000
        return initialValues
    }

    _updateObject (event, formData) {
        const data = foundry.utils.expandObject(formData)
        data['animate-darkness-ms'] = Number.parseFloat(data['animate-darkness']) * 1000
        console.debug('JD ETime | DaylightCycleMenu _updateObject: %o', data)
        game.settings.set(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS, data)
    }
}
