import { MODULE_ID, SETTINGS } from "./settings.js"

export function registerAutoTellTimeSettings () {
    // The settings menu
    game.settings.registerMenu(MODULE_ID, SETTINGS.AUTO_TELL_TIME_MENU, {
        name: game.i18n.localize('DBTIME.Settings.AutoTellTimeConfig.name'),
        label: game.i18n.localize('DBTIME.Settings.AutoTellTimeConfig.label'),
        hint: game.i18n.localize('DBTIME.Settings.AutoTellTimeConfig.hint'),
        icon: 'fas fa-cog',
        type: AutoTellTimeMenu,
        restricted: true,
    })

    // the settings object
    game.settings.register(MODULE_ID, SETTINGS.AUTO_TELL_TIME_SETTINGS, {
        scope: 'world',
        config: false,
        type: Object,
        default: {},
    })
}

class AutoTellTimeMenu extends FormApplication {
    static get defaultOptions () {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ['settings'],
            popOut: true,
            width: 400,
            template: 'modules/jd-dbtime/templates/autotelltimesettings.hbs',
            id: SETTINGS.AUTO_TELL_TIME_MENU,
            title: game.i18n.localize(
                'DBTIME.Settings.AutoTellTimeConfig.name'
            ),
        })
    }

    getData () {
        const initialValues = game.settings.get(
            MODULE_ID,
            SETTINGS.AUTO_TELL_TIME_SETTINGS
        )

        function buildShiftValues (hourArray, amPM) {
            let shiftArray = {}
            for (const h of hourArray) {
                const hour = `${h}:00 ${amPM}`
                shiftArray[hour] = initialValues[hour]
            }

            return shiftArray
        }

        const shiftTimes = {
            morning: buildShiftValues([6, 7, 8, 9, 10, 11], 'AM'),
            afternoon: buildShiftValues([12, 1, 2, 3, 4, 5], 'PM'),
            evening: buildShiftValues([6, 7, 8, 9, 10, 11], 'PM'),
            night: buildShiftValues([12, 1, 2, 3, 4, 5], 'AM'),
        }

        console.log(initialValues)
        console.log(shiftTimes)
        return shiftTimes
    }

    _updateObject (event, formData) {
        // gets data from the form, validates and persists if valid
        const data = foundry.utils.expandObject(formData)
        console.log('DB Time | AutoTell Setting Menu _updateObject: %o', data)
        game.settings.set(MODULE_ID, SETTINGS.AUTO_TELL_TIME_SETTINGS, data)
    }
}
