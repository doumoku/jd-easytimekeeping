import { Helpers } from './helpers.mjs'
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
        default: {
            morningName: game.i18n.localize('JDTIMEKEEPING.Shift.Morning'),
            afternoonName: game.i18n.localize('JDTIMEKEEPING.Shift.Afternoon'),
            eveningName: game.i18n.localize('JDTIMEKEEPING.Shift.Evening'),
            nightName: game.i18n.localize('JDTIMEKEEPING.Shift.Night'),
        },
        requiresReload: true,
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
        const current = game.settings.get(MODULE_ID, SETTINGS.SHIFT_SETTINGS)

        if (!Helpers.objectsShallowEqual(data, current)) {
            game.settings.set(MODULE_ID, SETTINGS.SHIFT_SETTINGS, data)
            SettingsConfig.reloadConfirm({ world: true })
        }
    }

    // activateListeners (html) {
    //     super.activateListeners(html)
    //     html.on('click', '[data-action=reset]', this._handleResetButtonClicked)
    // }

    async _handleResetButtonClicked (event) {
        console.log(event)
        // const me = $(event.delegateTarget).find('[name=morningName]')
        // me.value = game.i18n.localize('JDTIMEKEEPING.Shift.Morning')
    }
}
