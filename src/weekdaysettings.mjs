import { Helpers } from './helpers.mjs'
import { MODULE_ID, SETTINGS } from './settings.mjs'

const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
    'EightDay',
    'NineDay',
    'TenDay',
    'ElevenDay',
    'TwelveDay',
    'ThirteenDay',
    'FourteenDay',
]

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

    // the settings objects
    game.settings.register(MODULE_ID, SETTINGS.WEEKDAY_SETTINGS, {
        scope: 'world',
        config: false,
        type: Object,
        default: defaults,
    })

    game.settings.register(MODULE_ID, SETTINGS.DAYS_PER_WEEK, {
        scope: 'world',
        config: false,
        type: Number,
        default: DEFAULT_DAYS_PER_WEEK,
    })

    game.settings.register(MODULE_ID, SETTINGS.WEEK_NAME, {
        scope: 'world',
        config: false,
        type: String,
        default: game.i18n.localize('JDTIMEKEEPING.WeekName'),
    })
}

class WeekdaySettings extends FormApplication {
    static get defaultOptions () {
        return foundry.utils.mergeObject(super.defaultOptions, {
            popOut: true,
            width: 400,
            resizable: true,
            template: `modules/${MODULE_ID}/templates/weekdaysettings.hbs`,
            id: SETTINGS.WEEKDAY_MENU,
            title: 'JDTIMEKEEPING.Settings.WeekdayConfig.name',
        })
    }

    getData () {
        const initialDayNames = game.settings.get(MODULE_ID, SETTINGS.WEEKDAY_SETTINGS)
        const daysPerWeek = game.settings.get(MODULE_ID, SETTINGS.DAYS_PER_WEEK)
        const weekName = game.settings.get(MODULE_ID, SETTINGS.WEEK_NAME)

        const data = {}

        // build the list of week days
        data.weekdays = {}
        weekdays.forEach((v, i) => {
            const value = game.i18n.localize(`JDTIMEKEEPING.${v}`)
            data.weekdays[i] = {
                id: `${v.toLowerCase()}`,
                label: value,
                // initial value if we have one, or the default localised string if we don't have a setting value
                value: initialDayNames[v.toLowerCase()] ?? value,
                class: i >= daysPerWeek ? 'hidden' : '', // hide if not in use
            }
        })

        // The number of days per week
        data.daysPerWeek = {
            id: 'daysPerWeek',
            label: game.i18n.localize('JDTIMEKEEPING.Settings.DaysInWeek'),
            value: daysPerWeek,
            min: MIN_DAYS_PER_WEEK,
            max: MAX_DAYS_PER_WEEK,
        }

        // the name of the week itself
        data.weekName = {
            id: 'weekName',
            label: game.i18n.localize('JDTIMEKEEPING.Settings.WeekName.label'),
            value: weekName,
        }

        return data
    }

    async _updateObject (event, formData) {
        const data = foundry.utils.expandObject(formData)
        var reload = false

        const daysPerWeek = await game.settings.get(MODULE_ID, SETTINGS.DAYS_PER_WEEK)
        if (daysPerWeek != data.daysPerWeek) {
            game.settings.set(MODULE_ID, SETTINGS.DAYS_PER_WEEK, data.daysPerWeek)
            reload = true
        }
        delete data.daysPerWeek

        const weekName = await game.settings.get(MODULE_ID, SETTINGS.WEEK_NAME)
        if (weekName != data.weekName) {
            game.settings.set(MODULE_ID, SETTINGS.WEEK_NAME, data.weekName)
            reload = true
        }
        delete data.weekName

        const current = game.settings.get(MODULE_ID, SETTINGS.WEEKDAY_SETTINGS)
        if (!Helpers.objectsShallowEqual(data, current)) {
            game.settings.set(MODULE_ID, SETTINGS.WEEKDAY_SETTINGS, data)
            reload = true
        }

        if (reload) SettingsConfig.reloadConfirm({ world: true })
    }

    activateListeners (html) {
        super.activateListeners(html)
        html.on('click', '[data-action=reset]', this._handleResetButtonClicked.bind(this))
        html.on('change', '[name=daysPerWeek]', this._handleDaysPerWeekChanged.bind(this))
    }

    _handleDaysPerWeekChanged (event) {
        const daysPerWeek = Number.parseInt(event.currentTarget.value)
        this.#updateDayElements(event.delegateTarget, daysPerWeek)
    }

    #updateDayElements (delegateTarget, daysPerWeek) {
        weekdays.forEach((name, i) => {
            let element = $(delegateTarget).find(`[name=${name.toLowerCase()}]`).parent()
            if (element && element.length) {
                element = element[0]
                if (i >= daysPerWeek) element.style.display = 'none'
                else element.style.display = 'flex'
            }
        })
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
        $(event.delegateTarget).find('[name=weekName]')[0].value =
            game.i18n.localize('JDTIMEKEEPING.WeekName')

        this.#updateDayElements(event.delegateTarget, DEFAULT_DAYS_PER_WEEK)

        ui.notifications.notify(game.i18n.localize('SETTINGS.ResetInfo'))
    }
}
