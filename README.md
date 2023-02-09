# neotest-playwright

A [playwright](https://playwright.dev/) adapter for [neotest](https://github.com/nvim-neotest/neotest).

Written in typescript and transpiled to Lua using [tstl](https://github.com/TypeScriptToLua/TypeScriptToLua).

> ⚠️ This adapter is in an experimental state.

## Features

- [ ] Discover, run, and parse the output of playwright tests
- [x] Project selection + persistence
- [x] On-the-fly presets

## Installation

Using packer:

```lua
use({
   "nvim-neotest/neotest",
   requires = {
      -- ...,
      "thenbe/neotest-playwright",
   },
   config = function()
   require("neotest").setup({
      -- ...,
      adapters = {
         require("neotest-playwright").adapter({
            -- ...,
            options = {
               persist_project_selection = false,
            }
         }),
      },
   })
   end,
})
```

## Presets

Presets are a way to debug your tests on the fly.

> To select a preset, use the `:NeotestPlaywrightPreset` command.

### `headed`

> Applies the following flags: `--headed --retries 0 --timeout 0 --workers 1 --max-failures 0`

Runs tests in headed mode.

> Tip: Use with `await page.pause()` to open the playwright inspector and debug your locators.

### `debug`

> Applies the following flags: `--debug`

Playwright uses the `--debug` flag as a shortcut for multiple options. See [here](https://playwright.dev/docs/test-cli#reference) for more information.

### `none`

Does not apply any flags. Your tests will run as defined in your `playwright.config.ts` file.

## Projects

[Projects](https://playwright.dev/docs/test-advanced#projects) can be toggled on and off using the `:NeotestPlaywrightProject` command. Projects that are toggled on will be passed along to playwright using the `--project` flag.

Project selection can be persisted across neovim sessions by setting `persist_project_selection` to true. Selection is scoped to the project's root directory.

# Credits

- [neotest-jest](https://github.com/haydenmeade/neotest-jest)
