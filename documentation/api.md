# The API

All API functions are accessed from macros via

```js
game.modules.get('jd-easytimekeeping').api
```

## increment

```js
/**
 * Increment the time.
 *
 * @param {Object} time the time interval to increment by
 * @param {Number} [time.days=0] days
 * @param {Number} [time.hours=0] hours
 * @param {Number} [time.minutes=10] minutes
 */
game.modules.get('jd-easytimekeeping').api.increment(time)
```

Increments or decrements the time.

## set

## getPhaseOfDay

## getTime

## toTimeString

## tellTime

