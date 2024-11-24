import { Helpers } from './helpers.mjs'
import { MODULE_ID, SETTINGS } from './settings.mjs'

export function registerWeekdaySettings () {
    // The settings menu
    game.settings.registerMenu(MODULE_ID, SETTINGS.WEEKDAY_MENU, {
        // TODO: add these strings
        name: 'JDTIMEKEEPING.Settings.WeekdayConfig.name',
        label: 'JDTIMEKEEPING.Settings.WeekdayConfig.label',
        hint: 'JDTIMEKEEPING.Settings.WeekdayConfig.hint',
        icon: 'fas fa-cog',
        type: ShiftSettings,
        restricted: true,
    })

    // the settings object
    game.settings.register(MODULE_ID, SETTINGS.WEEKDAY_SETTINGS, {
        scope: 'world',
        config: false,
        type: Object,
        default: {
            // TODO: days of the week initial values
            // morningName: game.i18n.localize('JDTIMEKEEPING.Shift.Morning'),
            // afternoonName: game.i18n.localize('JDTIMEKEEPING.Shift.Afternoon'),
            // eveningName: game.i18n.localize('JDTIMEKEEPING.Shift.Evening'),
            // nightName: game.i18n.localize('JDTIMEKEEPING.Shift.Night'),
        },
        restricted: true,
        requiresReload: true,
    })
}

class WeekdaySettings extends FormApplication {
    static get defaultOptions () {
        return foundry.utils.mergeObject(super.defaultOptions, {
            popOut: true,
            width: 400,
            // TODO: add this template
            template: `modules/${MODULE_ID}/templates/weekdaysettings.hbs`,
            id: SETTINGS.WEEKDAY_MENU,
            title: 'JDTIMEKEEPING.Settings.WeekdayConfig.name',
        })
    }

    getData () {
        const initialValues = game.settings.get(MODULE_ID, SETTINGS.WEEKDAY_SETTINGS)
        // we can't have empty strings, so force any emptyish values back to the default
        // TODO: change to days of week
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
        const current = game.settings.get(MODULE_ID, SETTINGS.WEEKDAY_SETTINGS)

        if (!Helpers.objectsShallowEqual(data, current)) {
            game.settings.set(MODULE_ID, SETTINGS.WEEKDAY_SETTINGS, data)
            SettingsConfig.reloadConfirm({ world: true })
        }
    }

    // activateListeners (html) {
    //     super.activateListeners(html)
    //     html.on('click', '[data-action=reset]', this._handleResetButtonClicked)
    // }

    async _handleResetButtonClicked (event) {
        console.log(event)
        // TODO: implement this
        // const me = $(event.delegateTarget).find('[name=morningName]')
        // me.value = game.i18n.localize('JDTIMEKEEPING.Shift.Morning')
    }
}
