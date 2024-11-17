import { MODULE_ID, SETTINGS } from './settings.mjs'

export function registerShiftSettings () {
    // The settings menu
    game.settings.registerMenu(MODULE_ID, SETTINGS.SHIFT_MENU, {
        name: 'JDTIMEKEEPING.Settings.ShiftConfig.name',
        label: 'JDTIMEKEEPING.Settings.ShiftConfig.label',
        hint: 'JDTIMEKEEPING.Settings.ShiftConfig.hint',
        icon: 'fas fa-cog',
        type: ShiftSettings,
        restricted: true,
    })

    // the settings object
    game.settings.register(MODULE_ID, SETTINGS.SHIFT_SETTINGS, {
        scope: 'world',
        config: false,
        type: Object,
        default: {},
        restricted: true,
    })
}

class ShiftSettings extends FormApplication {
    static get defaultOptions () {
        return foundry.utils.mergeObject(super.defaultOptions, {
            popOut: true,
            width: 400,
            template: `modules/${MODULE_ID}/templates/shiftsettings.hbs`,
            id: SETTINGS.SHIFT_MENU,
            title: 'JDTIMEKEEPING.Settings.ShiftConfig.name',
        })
    }

    getData () {
        const initialValues = game.settings.get(MODULE_ID, SETTINGS.SHIFT_SETTINGS)

        return initialValues
    }

    _updateObject (event, formData) {
        const data = foundry.utils.expandObject(formData)
        game.settings.set(MODULE_ID, SETTINGS.SHIFT_SETTINGS, data)
    }

    activateListeners (html) {
        super.activateListeners(html)
    }
}

