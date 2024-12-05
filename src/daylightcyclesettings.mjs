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

const DAYLIGHTCYLE_UI_DEFAULTS = {
    'day-darkness-level': 0,
    'night-darkness-level': 1.0,
    'dusk-start': '18:00',
    'dusk-duration': 60,
    'dawn-start': '06:00',
    'dawn-duration': 60,
    'animate-darkness': 5, // The UI is in seconds, not milliseconds
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

    async _updateObject (event, formData) {
        const data = foundry.utils.expandObject(formData)
        data['animate-darkness-ms'] = Number.parseFloat(data['animate-darkness']) * 1000
        console.debug('JD ETime | DaylightCycleMenu _updateObject: %o', data)
        await game.settings.set(MODULE_ID, SETTINGS.DAYLIGHT_CYCLE_SETTINGS, data)

        // set the time to the current time to force a time change event
        // so that the DaylightCycle class can respond to any settings 
        // changes that might have been made
        const api = game.modules.get(MODULE_ID).api
        api.set(api.getTime())
    }

    activateListeners (html) {
        super.activateListeners(html)
        html.on('click', '[data-action=reset]', this._handleResetButtonClicked)
    }

    async _handleResetButtonClicked (event) {
        console.log('JD ETime | Reset Daylight Cycle settings to default values')
        for (const [key, value] of Object.entries(DAYLIGHTCYLE_UI_DEFAULTS)) {
            const element = $(event.delegateTarget).find(`[name=${key}]`)
            if (element && element.length > 0) element[0].value = value
        }
        $(event.delegateTarget).find('[name=daylight-cycle-enabled]')?.prop('checked', false)
        ui.notifications.notify(game.i18n.localize('SETTINGS.ResetInfo'))
    }
}
