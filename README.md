# Easy Timekeeping

![Static Badge](https://img.shields.io/badge/Module%20Status%3A-Alpha-red)

> [!CAUTION]
> This module is still a work in progress, and is not yet ready for use. It has not been released. If you really want some timekeeping goodness, you'll be better off with [the original macro version](https://github.com/DC23/foundry-macros/blob/main/dbtime/dbtime-readme.md). I don't maintain that version anymore, and it's harder to install than this module, but at least it's ready to use now.

***Easy Timekeeping*** implements simple timekeeping without any fuss or complicated features. I originally wrote this as a set of macros for the [Dragonbane game system](https://foundryvtt.com/packages/dragonbane), built on top of the [Global Progress Clocks](https://foundryvtt.com/packages/global-progress-clocks) module. While those [macros are still available](https://github.com/DC23/foundry-macros/blob/main/dbtime/dbtime-readme.md), I don't maintain them anymore, they are fragile, and relatively difficult to install.

In it's current form, Easy Timekeeping is no longer uniquely tailored to the Dragonbane RPG, though it still works wonderfully with the 15 minute stretches and 6 hour shifts of that game. It's a lightweight, customisable, and easy to use timekeeping tool for any game.

Easy Timekeeping has the following main features:

- The GM is always in control of the passage of time.
- The UI allows quickly incrementing or decrementing time by configurable small and large jumps.
- An optional daylight cycle provides configurable automation of scene lighting.
- Configurable ability to post the time to chat at regular times of day. Particularly useful when combined with the option to hide the time of day display on the main UI.
- An API allows many features to be controlled from macros, such as setting the time, incrementing or decrementing the time, querying the current time, and posting the time to chat.
- Time change events allow further automation. There is a hook for world scripts, and the ability to specify a time change handler macro through the module settings (requires GM permissions). This allows you to develop scripted events that occur in response to the passage of time, or that take place only at certain times of day.

## So, What About that SmallTime Module?

I owe a huge debt to the wonderful [SmallTime](https://foundryvtt.com/packages/smalltime) module, whose UI I have adapted (hooray for the MIT licence!). Since this means that on the surface, Easy Timekeeping looks and works much the same as SmallTime, I probably should spend a little time explaining why I created Easy Timekeeping when SmallTime already does the same job.

First, I had no idea SmallTime existed when I started. I started writing this to teach myself how to develop Foundry modules, by taking some macros I'd made and converting them into something more polished. I'd advanced about 60% through the module development, testing only through the API when I asked at the Foundry Discord for ideas on how to build a UI. Someone mentioned SmallTime. I took a look, and realised with a sense of dread that the module pretty much did everything I was planning to do. But when the initial discouragement faded, I took a closer look and realised that wasn't correct. Many of the decisions that had been taken with SmallTime were not decisions I would have taken. While I loved the UI, I didn't want the calendar integrations. I liked my code, and wanted to complete it. I thought I had something interesting with the API and the way I allowed the time change event to call back to a GM macro - something SmallTime doesn't have.

But I really do love the SmallTime UI. And I suck at building that sort of thing.

Good thing we both use the MIT licence. And it's a good thing there's plenty of room in the open-source world for different interpretations of the same idea.

So, here's Easy Timekeeping. The UI looks a lot like SmallTime, but it does a bit less, does it very differently under the hood, and lets you do different things if scripting and automation is your thing.
