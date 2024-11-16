# Easy Timekeeping

![Static Badge](https://img.shields.io/badge/Module%20Status%3A-Alpha-red)
![Static Badge](https://img.shields.io/badge/Version-0.6.0-blue)
[![Release Build](https://github.com/DC23/jd-easytimekeeping/actions/workflows/main.yml/badge.svg)](https://github.com/DC23/jd-easytimekeeping/actions/workflows/main.yml)

> [!CAUTION]
> This module is still a work in progress, and it has not yet been published to Foundry. If you are brave and want to try it out, it can be installed from the manifest URL as described in the [Foundry documentation](https://foundryvtt.com/article/modules/).

```html
https://github.com/DC23/jd-easytimekeeping/releases/latest/download/module.json
```

---

***Easy Timekeeping*** implements simple timekeeping without any fuss or complicated features. I originally wrote this as a set of macros for the [Dragonbane game system](https://foundryvtt.com/packages/dragonbane), built on top of the [Global Progress Clocks](https://foundryvtt.com/packages/global-progress-clocks) module. While those [macros are still available](https://github.com/DC23/foundry-macros/blob/main/dbtime/dbtime-readme.md), I don't maintain them anymore, they are fragile, and relatively difficult to install.

In it's current form, Easy Timekeeping is no longer uniquely tailored to the Dragonbane RPG, though it still works wonderfully with the 15 minute stretches and 6 hour shifts of that game. It's a lightweight, customisable, and easy to use timekeeping tool for any game.

Easy Timekeeping has the following main features:

- The GM is always in control of the passage of time.
- The UI allows the GM to quickly change the time by configurable small and large jumps.
- An optional daylight cycle provides configurable automation of scene lighting.
- Special modes for Dragonbane that support fuzzy time showing just the current stretch and shift in words and visual form. The precise time of day can optionally be hidden from players.
- Configurable ability to post the time to chat at regular times of day. Particularly useful when combined with the option to hide the time of day display on the main UI.
- An API allows many features to be controlled from macros, such as setting the time, incrementing or decrementing the time, querying the current time, and posting the time to chat.
- Time change events allow further automation. There is a hook for world scripts, and the ability to specify a time change handler macro through the module settings (requires GM permissions). This allows you to develop scripted events that occur in response to the passage of time, or that take place only at certain times of day.
