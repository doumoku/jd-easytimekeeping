# Dragonbane Timekeeping

![Static Badge](https://img.shields.io/badge/Module%20Status%3A-Alpha-red)

> [!CAUTION]
> This module is still a work in progress, and is not yet ready for use. It has not been released. If you really want some timekeeping goodness, you'll be better off with [the original macro version](https://github.com/DC23/foundry-macros/blob/main/dbtime/dbtime-readme.md). I don't maintain that version anymore, and it's harder to install than this module, but at least it's ready to use now.

***Dragonbane Timekeeping***, or ***DB Time*** for short, implements simple timekeeping for the [Dragonbane game system](https://foundryvtt.com/packages/dragonbane) on top of the [Global Progress Clocks](https://foundryvtt.com/packages/global-progress-clocks) module.

It has the following main features:

- Tracks the time in stretches and shifts, and optionally in hours and days.
- Can post the time in hours and minutes and day to chat.
- Provides hooks for easy customisation when the time changes.

I had a few goals when creating this system:

- The GM is always in control. While this module keeps track of the passage of time, it never takes decisions away from the GM.
- It should remain simple to use. Outside of the Foundry settings, there is no user interface. Simple macros placed in the Foundry Macro Toolbar provide one-click buttons for all operations - advance time by a stretch, a shift, or any other time interval you require. This module provides ready-made script macros for the most common requirements which you can customise to meet any need.

## Dependencies

- [Global Progress Clocks](https://foundryvtt.com/packages/global-progress-clocks)
