import { Helpers } from './helpers.mjs'
import { MODULE_ID, SETTINGS } from './settings.mjs'

// todo: take the name of the week out of this array. It needs to be only for the weekday names.
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const MIN_DAYS_PER_WEEK = 5
const MAX_DAYS_PER_WEEK = 14
const DEFAULT_DAYS_PER_WEEK = 7

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

    defaults.daysPerWeek = DEFAULT_DAYS_PER_WEEK

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

        // build the list of week days
        data.weekdays = {}
        weekdays.forEach((v, i) => {
            data.weekdays[i] = {
                id: `${v.toLowerCase()}`,
                label: game.i18n.localize(`JDTIMEKEEPING.${v}`),
                value: initialValues[v.toLowerCase()],
            }
        })

        // The number of days per week
        // todo: will need to redraw the form when this changes
        data.daysPerWeek = {
            id: 'daysPerWeek',
            label: game.i18n.localize('JDTIMEKEEPING.Settings.DaysInWeek'),
            value: initialValues.daysPerWeek,
            min: MIN_DAYS_PER_WEEK,
            max: MAX_DAYS_PER_WEEK,
        }

        // the name of the week itself
        data.weekname = {
            id: 'weekname',
            label: game.i18n.localize('JDTIMEKEEPING.Settings.WeekName.label'),
            value: initialValues.weekname,
        }

        return data
    }

    _updateObject (event, formData) {
        // todo: I might need to munge the form data to add some structure. Right now it's one flat object
        const data = foundry.utils.expandObject(formData)
        const current = game.settings.get(MODULE_ID, SETTINGS.WEEKDAY_SETTINGS)

        if (!Helpers.objectsShallowEqual(data, current)) {
            game.settings.set(MODULE_ID, SETTINGS.WEEKDAY_SETTINGS, data)
            // The days of the week don't need a reload at the moment.
            // SettingsConfig.reloadConfirm({ world: true })
        }
    }

    activateListeners (html) {
        super.activateListeners(html)
        html.on('click', '[data-action=reset]', this._handleResetButtonClicked)
    }

    async _handleResetButtonClicked (event) {
        console.log('JD ETime | Reset Weekday settings to default values')
        weekdays.forEach(id => {
            const element = $(event.delegateTarget).find(`[name=${id.toLowerCase()}]`)
            if (element && element.length > 0) {
                element[0].value = game.i18n.localize(`JDTIMEKEEPING.${id}`)
            }
        })

        $(event.delegateTarget).find('[name=daysPerWeek]')[0].value = DEFAULT_DAYS_PER_WEEK
        $(event.delegateTarget).find('[name=weekname]')[0].value =
            game.i18n.localize('JDTIMEKEEPING.WeekName')

        ui.notifications.notify(game.i18n.localize('SETTINGS.ResetInfo'))
    }
}
