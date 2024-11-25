import { Helpers } from './helpers.mjs'
import { MODULE_ID, SETTINGS } from './settings.mjs'

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function registerWeekdaySettings () {
    // The settings menu
    game.settings.registerMenu(MODULE_ID, SETTINGS.WEEKDAY_MENU, {
        name: 'JDTIMEKEEPING.Settings.WeekdayConfig.name',
        label: 'JDTIMEKEEPING.Settings.WeekdayConfig.label',
        hint: 'JDTIMEKEEPING.Settings.WeekdayConfig.hint',
        icon: 'fas fa-cog',
        type: WeekdaySettings,
        restricted: true,
    })

    const defaults = {}
    weekdays.forEach((v, i) => {
        defaults[v.toLowerCase()] = game.i18n.localize(`JDTIMEKEEPING.${v}`)
    })

    // the settings object
    game.settings.register(MODULE_ID, SETTINGS.WEEKDAY_SETTINGS, {
        scope: 'world',
        config: false,
        type: Object,
        default: defaults,
        requiresReload: true,
    })
}

class WeekdaySettings extends FormApplication {
    static get defaultOptions () {
        return foundry.utils.mergeObject(super.defaultOptions, {
            popOut: true,
            width: 400,
            template: `modules/${MODULE_ID}/templates/weekdaysettings.hbs`,
            id: SETTINGS.WEEKDAY_MENU,
            title: 'JDTIMEKEEPING.Settings.WeekdayConfig.name',
        })
    }

    getData () {
        const initialValues = game.settings.get(MODULE_ID, SETTINGS.WEEKDAY_SETTINGS)
        const data = {}
        weekdays.forEach((v, i) => {
            data[i] = { 
                id: `${v.toLowerCase()}`,
                label: game.i18n.localize(`JDTIMEKEEPING.${v}`),
                value: initialValues[v.toLowerCase()] }
        })
        return data
    }

    _updateObject (event, formData) {
        const data = foundry.utils.expandObject(formData)
        const current = game.settings.get(MODULE_ID, SETTINGS.WEEKDAY_SETTINGS)

        if (!Helpers.objectsShallowEqual(data, current)) {
            game.settings.set(MODULE_ID, SETTINGS.WEEKDAY_SETTINGS, data)
            // SettingsConfig.reloadConfirm({ world: true })
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
