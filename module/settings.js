const MODULE_ID = 'jd-dbtime'

function registerSettings () {
    game.settings.register(MODULE_ID, 'showHourClock', {
        name: 'Show Hours',
        hint: 'Should the hour clock be shown?',
        scope: 'world', 
        config: true, 
        type: Boolean,
        default: false,
        onChange: value => {
            console.log(value)
        },
        requiresReload: true,
    })
}
