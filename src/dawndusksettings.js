import { MODULE_ID, SETTINGS } from './settings.js'

export function registerDawnDuskSettings () {
    // The settings menu
    game.settings.registerMenu(MODULE_ID, SETTINGS.DAWN_DUSK_MENU, {
        name: game.i18n.localize('DBTIME.Settings.DawnDuskConfig.name'),
        label: game.i18n.localize('DBTIME.Settings.DawnDuskConfig.label'),
        hint: game.i18n.localize('DBTIME.Settings.DawnDuskConfig.hint'),
        icon: 'fas fa-cog',
        type: DawnDuskMenu,
        restricted: true,
    })

    // the settings object
    game.settings.register(MODULE_ID, SETTINGS.DAWN_DUSK_SETTINGS, {
        scope: 'world',
        config: false,
        type: Object,
        default: {
            'dawn-dusk-enabled': false,
            'day-darkness-level': 0,
            'night-darkness-level': 1.0,
            'sunset-start': '6:00 PM',
            'dawn-start': '6:00 AM',
        },
    })
}

class DawnDuskMenu extends FormApplication {
    static get defaultOptions () {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ['settings'],
            popOut: true,
            width: 500,
            template: 'modules/jd-dbtime/templates/dawndusk.hbs',
            id: SETTINGS.DAWN_DUSK_MENU,
            title: game.i18n.localize('DBTIME.Settings.DawnDuskConfig.name'),
        })
    }

    getData () {
        const initialValues = game.settings.get(
            MODULE_ID,
            SETTINGS.DAWN_DUSK_SETTINGS
        )

        // TODO: I could do better than this fixed choice of options for
        // starting sunset and sunrise, but it's good enough for now
        const sunsetOptions = {
            '5:00 PM': false,
            '5:30 PM': false,
            '6:00 PM': false,
            '6:30 PM': false,
        }

        const dawnOptions = {
            '5:00 AM': false,
            '5:30 AM': false,
            '6:00 AM': false,
            '6:30 AM': false,
        }

        // set the initial values for the form
        sunsetOptions[initialValues['sunset-start']] = true
        dawnOptions[initialValues['dawn-start']] = true
        initialValues['sunset-start-options'] = sunsetOptions
        initialValues['dawn-start-options'] = dawnOptions
        console.log(initialValues)
        return initialValues
    }

    _updateObject (event, formData) {
        // gets data from the form, validates and persists if valid
        const data = foundry.utils.expandObject(formData)
        console.log('DB Time | DawnDuskMenu _updateObject: %o', data)
        game.settings.set(MODULE_ID, SETTINGS.DAWN_DUSK_SETTINGS, data)
    }
}
