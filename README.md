# Easy Timekeeping

![Static Badge](https://img.shields.io/badge/Module%20Status%3A-Alpha-red)
![Static Badge](https://img.shields.io/badge/Version-0.6.3-blue)
[![Release Build](https://github.com/DC23/jd-easytimekeeping/actions/workflows/main.yml/badge.svg)](https://github.com/DC23/jd-easytimekeeping/actions/workflows/main.yml)

> [!CAUTION]
> This module is still a work in progress, and it has not yet been published to Foundry. If you are brave and want to try it out, it can be installed from the manifest URL as described in the [Foundry documentation](https://foundryvtt.com/article/modules/).

```html
https://github.com/DC23/jd-easytimekeeping/releases/latest/download/module.json
```

---

**Easy Timekeeping** implements simple timekeeping without any fuss or complicated features. I originally wrote this as a set of macros for the [Dragonbane game system](https://foundryvtt.com/packages/dragonbane), built on top of the [Global Progress Clocks](https://foundryvtt.com/packages/global-progress-clocks) module. While those [macros are still available](https://github.com/DC23/foundry-macros/blob/main/dbtime/dbtime-readme.md), I don't maintain them anymore, they are fragile, and relatively difficult to install.

In it's current form, **Easy Timekeeping** is no longer uniquely tailored to the Dragonbane RPG, though it still works wonderfully with the 15 minute stretches and 6 hour shifts of that game. It's a lightweight, customisable, and easy to use timekeeping tool for any game.

**Easy Timekeeping** has the following main features:

- The GM is always in control of the passage of time.
- The UI allows the GM to quickly change the time by configurable small and large jumps.
- An optional daylight cycle provides configurable automation of scene lighting.
- Special modes for Dragonbane that support fuzzy time showing just the current stretch and shift in words and visual form. The precise time of day can optionally be hidden from players.
- Configurable ability to post the time to chat at regular times of day. Particularly useful when combined with the option to hide the time of day display on the main UI.
- An API allows many features to be controlled from macros, such as setting the time, incrementing or decrementing the time, querying the current time, and posting the time to chat.
- Time change events allow further automation. There is a hook for world scripts, and the ability to specify a time change handler macro through the module settings (requires GM permissions). This allows you to develop scripted events that occur in response to the passage of time, or that take place only at certain times of day.

## The API

The [**Easy Timekeeping** API](./documentation/timekeeper.md) can be accessed from Foundry macros with:

```js
game.modules.get('jd-easytimekeeping').api
```

From macros, you can do everything that the UI allows - setting, incrementing, and decrementing the time.

### The Time Change Event

Another way to interact with **Easy Timekeeping** is through the Time Change event. This is called whenever the time changes through any means - the UI or by the API. You can listen to the event from a [World Script](https://foundryvtt.wiki/en/basics/world-scripts) by subscribing to the time change hook. For example:

```js
Hooks.on(game.modules.get(MODULE_ID).timeChangeHookName, (data) => {
    console.log(data)
})
```

If you don't want to mess around with world scripts, then as GM you can register a standard script macro in the module settings with the *Time Change Event Handler* setting. The registered macro will be called when the time changes. Unlike the hook, the data object gets exploded and your macro will receive the `oldTime` and `time` variables directly as globals.

`oldTime` and `time` (or `data.oldTime` & `data.time` in a world script) are [`timeAugmented`](./documentation/timekeeper.md#timeaugmented) objects.

## A Few Thanks

I'd like to thank a few projects and communities, without whom this project probably wouldn't exist.

- The fantastic people at the Dragonbane Community Discord (you can find a permanent invite link at [the Free League forum](https://forum.frialigan.se/viewtopic.php?t=12039)). It was a quick Foundry macro built on Global Progress Clocks that eventually led to this module.
- The equally fantastic (and occassionally the same) people at the Foundry VTT Discord. With the technical help in the `#macro-polo`, `#module-development`, and `#system-development` channels I'd be cowering under my desk by now.
- The devs of [Global Progress Clocks](https://github.com/CarlosFdez/global-progress-clocks). Thanks to the magic of MIT licencing I've adapted the radial clocks right into this module.
- The devs of [SmallTime](https://github.com/unsoluble/smalltime). While I've not used any of the code, I've drawn a lot of inspiration from the UI of SmallTime.

### What Was That About SmallTime?

Inspired by the UI? Really, is that all? What about all the rest of it? That's the funny thing. I'd implemented my [macro proof of concept](https://github.com/DC23/foundry-macros/blob/main/dbtime/dbtime-readme.md), complete with day/night lighting cycle and was well underway on this module before I knew that SmallTime even existed. I arrived at the same idea independently. And since I wrote this module primarily as a way to teach myself how to write a Foundry module, it didn't seem to matter that it did more or less the same thing. Somewhere in the Foundry Discord is the conversation where I'm asking for ideas on how to write a UI for my timekeeping module and someone mentions the way that SmallTime does things. That's the first I'd heard of it. There followed a short period of disillusionment followed by the realisation that it simply doesn't matter. I had my own ideas for a new twist on things, so here we are.
