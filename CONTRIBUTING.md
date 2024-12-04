# How to Contribute to the Easy Timekeeping Project

## Did you find a bug?

- **Ensure the bug was not already reported** by searching on GitHub under [Issues]().

- If you're unable to find an open issue addressing the problem, then open a new one, preferrably using one of the templates. Include as much information as possible about the issue, when it occurs, and how to reproduce or find it. The templates provide guidance on exactly what information we find most helpful.

## Do you have ideas for new features, or changes you'd like to see? 

- Post a [feature request](https://github.com/DC23/jd-easytimekeeping/issues). Be sure to use the template :)

## Do you intend to add a new feature or change an existing one?

Great!

- It's the standard open-source approach:
  - make an issue for the feature request if it's a new feature, or add a comment to the issue if it's an existing one.
  - make a branch in your fork corresponding to the new feature, bug fix, or change.
  - Submit the Pull Request.
  - Try to restrict it to one feature or bug per PR. Complex Pull Requests containing multiple changes, features, or bug fixes are difficult to review and test and I may decide that it's just too hard to accept.
- New translations are always welcome :heart:
- Note PRs consisting entirely or predominantly of cosmetic changes to code - formatting and so on - will not be accepted unless you have a very strong argument for why it's an improvement to the code quality.
  I use [Prettier](https://prettier.io/) in VS Code to do the formatting, with the configuration in the [.prettierrc](./.prettierrc) file. Ideally, any PRs with code will already be formatted but if they are not then
  I will format them after merging.

## A Note About the API Documentation

The API documentation is built with [documentation.js](https://github.com/documentationjs/documentation). The current setup is a bit old-school, 
in that I'm building the documentation at the command-line with Make and then manually committing the updated files to git. 
It will make a lot more sense to move this workflow into a GitHub Action, and I will probably do that one day. 
But for now, just make sure any code PRs have sensible JSDoc on them and the API docs will work themselves out.

---

Remember, this is a volunteer effort, run by people with lives and committments.

Thanks! :heart: :heart: :heart:
