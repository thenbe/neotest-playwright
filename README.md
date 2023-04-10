# neotest-playwright

A [playwright](https://playwright.dev/) adapter for [neotest](https://github.com/nvim-neotest/neotest).

Written in typescript and transpiled to Lua using [tstl](https://github.com/TypeScriptToLua/TypeScriptToLua).

> ⚠️ This adapter is in an experimental state.

## Features

- [ ] Discover, run, and parse the output of playwright tests
- [x] Project selection + persistence
- [x] On-the-fly presets

---

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
            options = {
               persist_project_selection = false,

               enable_dynamic_test_discovery = false,

               -- get_playwright_binary = function()
               --    return "path/to/playwright-binary"
               -- end,

               -- get_playwright_config = function()
               --    return "path/to/playwright.config.ts"
               -- end,

               -- get_cwd = function()
               --    return "path/to/dir"
               -- end,

               -- env = {
               --    HELLO = "world",
               -- },

               -- Extra args to always pass to playwright.
               -- These are merged with any extra_arg passed
               -- to neotest's run command.
               -- extra_args = {
               --    "--retries=0",
               --    "--max-failures=5",
               -- },

            }
         }),
      },
   })
   end,
})
```

---

## Projects

`neotest-playwright` allows you to conveniently toggle your playwright [Projects](https://playwright.dev/docs/test-advanced#projects) on and off. To activate (or deactivate) a project, use the `:NeotestPlaywrightProject` command. `neotest-playwright` will only include the projects you've activated in any subsequent playwright commands (using the `--project` flag). Your selection will persist until you either change it with `:NeotestPlaywrightProject`, or restart neovim.

If you wish, you can choose to persist your project selection across neovim sessions by setting `persist_project_selection` to true (see example). Selection data is keyed by the project's root directory, meaning you can persist multiple distinct selections across different projects (or git worktrees).

[![asciicast](https://asciinema.org/a/558555.svg)](https://asciinema.org/a/558555)

---

## Presets

Presets are a way to debug your tests on the fly.

> To select a preset, use the `:NeotestPlaywrightPreset` command. Once a preset is selected, it remains active until you either select another preset, clear it by selecting the `none` preset, or restart neovim.

### `headed`

> Applies the following flags: `--headed --retries 0 --timeout 0 --workers 1 --max-failures 0`

Runs tests in headed mode.

> 💡 Tip: Use with [`await page.pause()`](https://playwright.dev/docs/api/class-page#page-pause) to open the playwright inspector and debug your locators.

### `debug`

> Applies the following flags: `--debug`

Playwright uses the `--debug` flag as a shortcut for multiple options. See [here](https://playwright.dev/docs/test-cli#reference) for more information.

### `none`

Does not apply any flags. Your tests will run as defined in your `playwright.config.ts` file.

---

# Credits

- [neotest-jest](https://github.com/haydenmeade/neotest-jest)
