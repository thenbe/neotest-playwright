# neotest-playwright

A [playwright](https://playwright.dev/) adapter for [neotest](https://github.com/nvim-neotest/neotest).

Written in typescript and transpiled to Lua using [tstl](https://github.com/TypeScriptToLua/TypeScriptToLua).

> ⚠️ This adapter is in an experimental state.

## Features

- 🎭 Discover, run, and parse the output of playwright tests
- ⌨️ Quick launch test attachments ( 🕵️ trace, 📼 video)
- 💅 Project selection + persistence
- ⚙️ On-the-fly presets

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
               persist_project_selection = true,
               enable_dynamic_test_discovery = true,
            }
         }),
      },
   })
   end,
})
```

# Configuration

```lua
require("neotest-playwright").adapter({
   options = {
		-- defaults values shown

      persist_project_selection = false,

      enable_dynamic_test_discovery = false,

      preset = "none", -- "none" | "headed" | "debug"

      -- get_playwright_binary = function()
      --    return vim.loop.cwd() + "/node_modules/.bin/playwright"
      -- end,

      -- get_playwright_config = function()
      --    return vim.loop.cwd() + "/playwright.config.ts"
      -- end,

      -- get_cwd = function()
      --    return vim.loop.cwd()
      -- end,

      -- env = { },

      -- Extra args to always pass to playwright.
      -- These are merged with any extra_arg passed
      -- to neotest's run command.
      -- extra_args = { },

   }
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

## Dynamic Test Discovery

`neotest-playwright` can make use of the `playwright` cli to unlock extra features. Most importantly, the `playwright` cli provides information about which tests belongs to which project. `neotest-playwright` will parse this information to display, run, and report the results of tests on a per-project basis.

To enable this, set `enable_dynamic_test_discovery` to true.

### Caveats:

This feature works by calling `playwright test --list --reporter=json`. While this is a relatively fast operation, it does add some overhead. Therefore, `neotest-playwright` only calls this feature once (when the adapter is first initialized). From then on, `neotest-playwright` continues to rely on treesitter to track your tests and enhance them with the data previously resolved by the `playwright` cli. There are times, however, where we want to refresh this data. To remedy this: `neotest-playwright` exposes a command `:NeotestPlaywrightRefresh`. This comes in handy in the following scenarios:

- Adding a new test
- Renaming a test
- Changing the project(s) configuration in your `playwright.config.ts` file

## Consumers

### Attachment

Displays the attachments for the test under the cursor. Upon selection, the attachment is launched.

https://user-images.githubusercontent.com/33713262/231016415-d110f491-290e-46e3-a118-b3d4802723ca.mp4

#### Configuration

> Requires `enable_dynamic_test_discovery = true`.

1. Include the consumer in your `neotest` setup:

```lua
require("neotest").setup({
  consumers = {
    -- add to your consumers list
    playwright = require("neotest-playwright.consumers").consumers,
  },
})
```

2. Add keybinding:

```lua
{
  "thenbe/neotest-playwright",
  keys = {
    {
      "<leader>ta",
      function()
        require("neotest").playwright.attachment()
      end,
      desc = "Launch test attachment",
    },
  },
}
```

## Credits

- [neotest-jest](https://github.com/haydenmeade/neotest-jest)
