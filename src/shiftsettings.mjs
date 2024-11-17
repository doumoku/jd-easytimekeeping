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
        resizable: true,
    })

    // the settings object
    game.settings.register(MODULE_ID, SETTINGS.SHIFT_SETTINGS, {
        scope: 'world',
        config: false,
        type: Object,
        default: {
            morningName: game.i18n.localize('JDTIMEKEEPING.Shift.Morning'),
            afternoonName: game.i18n.localize('JDTIMEKEEPING.Shift.Afternoon'),
            eveningName: game.i18n.localize('JDTIMEKEEPING.Shift.Evening'),
            nightName: game.i18n.localize('JDTIMEKEEPING.Shift.Night'),
        },
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
        // we can't have empty strings, so force any emptyish values back to the default
        initialValues.morningName =
            initialValues.morningName || game.i18n.localize('JDTIMEKEEPING.Shift.Morning')
        initialValues.afternoonName =
            initialValues.afternoonName || game.i18n.localize('JDTIMEKEEPING.Shift.Afternoon')
        initialValues.eveningName =
            initialValues.eveningName || game.i18n.localize('JDTIMEKEEPING.Shift.Evening')
        initialValues.nightName =
            initialValues.nightName || game.i18n.localize('JDTIMEKEEPING.Shift.Night')
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
