# neotest-playwright

A [playwright](https://playwright.dev/) adapter for [neotest](https://github.com/nvim-neotest/neotest).

Written in typescript and transpiled to Lua using [tstl](https://github.com/TypeScriptToLua/TypeScriptToLua).

## Features

- 🎭 Discover, run, and parse the output of playwright tests
- ⌨️ Quick launch test attachments ( 🕵️ trace, 📼 video)
- 💅 Project selection + persistence
- ⚙️ On-the-fly presets

---

## Demo

https://user-images.githubusercontent.com/33713262/233094989-4073e15f-e72d-4356-9c26-021ca95aa7fd.mp4

---

## Table of contents

<!--toc:start-->

- [neotest-playwright](#neotest-playwright)
  - [Features](#features)
  - [Demo](#demo)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Projects](#projects)
  - [Presets](#presets)
    - [`headed`](#headed)
    - [`debug`](#debug)
    - [`none`](#none)
  - [Dynamic Test Discovery](#dynamic-test-discovery)
    - [Caveats](#caveats)
  - [Consumers](#consumers)
    - [Attachment](#attachment)
    - [Consumers Configuration](#consumers-configuration)
  - [Performance](#performance)
  - [Troubleshooting](#troubleshooting)
  - [Credits](#credits)
  <!--toc:end-->

## Installation

Using packer:

```lua
use({
  "nvim-neotest/neotest",
  requires = {
    -- ...
    "thenbe/neotest-playwright",
  },
  config = function()
    require("neotest").setup({
      -- ...
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

## Configuration

```lua
require("neotest-playwright").adapter({
  -- default values shown
  options = {
    persist_project_selection = false,

    enable_dynamic_test_discovery = false,

    preset = "none", -- "none" | "headed" | "debug"

    -- get_playwright_binary = function()
    --   return vim.loop.cwd() + "/node_modules/.bin/playwright"
    -- end,

    -- get_playwright_config = function()
    --   return vim.loop.cwd() + "/playwright.config.ts"
    -- end,

    -- Controls the location of the spawned test process.
    -- Has no affect on neither the location of the binary nor the location of the config file.
    -- get_cwd = function()
    --   return vim.loop.cwd()
    -- end,

    -- env = { },

    -- Extra args to always passed to playwright. These are merged with any extra_args passed to neotest's run command.
    -- extra_args = { },

    -- Filter directories when searching for test files. Useful in large projects (see performance notes).
    -- filter_dir = function(name, rel_path, root)
    --   return name ~= "node_modules"
    -- end,
  },
})
```

---

## Projects

`neotest-playwright` allows you to conveniently toggle your playwright [Projects](https://playwright.dev/docs/test-advanced#projects) on and off. To activate (or deactivate) a project, use the `:NeotestPlaywrightProject` command. `neotest-playwright` will only include the projects you've activated in any subsequent playwright commands (using the `--project` flag). Your selection will persist until you either change it with `:NeotestPlaywrightProject`, or restart neovim.

If you wish, you can choose to persist your project selection across neovim sessions by setting `persist_project_selection` to true (see example). Selection data is keyed by the project's root directory, meaning you can persist multiple distinct selections across different projects (or git worktrees).

[![asciicast](https://asciinema.org/a/558555.svg)](https://asciinema.org/a/558555)

---

## Presets

Presets can help you debug your tests on the fly. A preset is just a group of command line flags that come in handy in common scenarios.

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

### Caveats

This feature works by calling `playwright test --list --reporter=json`. While this is a relatively fast operation, it does add some overhead. Therefore, `neotest-playwright` only calls this feature once (when the adapter is first initialized). From then on, `neotest-playwright` continues to rely on treesitter to track your tests and enhance them with the data previously resolved by the `playwright` cli. There are times, however, where we want to refresh this data. To remedy this: `neotest-playwright` exposes a command `:NeotestPlaywrightRefresh`. This comes in handy in the following scenarios:

- Adding a new test
- Renaming a test
- Changing the project(s) configuration in your `playwright.config.ts` file

## Consumers

### Attachment

Displays the attachments for the test under the cursor. Upon selection, the attachment is launched.

https://user-images.githubusercontent.com/33713262/231016415-d110f491-290e-46e3-a118-b3d4802723ca.mp4

### Consumers Configuration

> Requires `enable_dynamic_test_discovery = true`.

1. Include the consumer in your `neotest` setup:

    ```lua
    require("neotest").setup({
      consumers = {
        -- add to your list of consumers
        playwright = require("neotest-playwright.consumers").consumers,
      },
    })
    ```

1. Add keybinding:

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

## Performance

Use `filter_dir` option to limit directories to be searched for tests.

```lua
---Filter directories when searching for test files
---@async
---@param name string Name of directory
---@param rel_path string Path to directory, relative to root
---@param root string Root directory of project
---@return boolean
filter_dir = function(name, rel_path, root)
  local full_path = root .. "/" .. rel_path

  if root:match("projects/my-large-monorepo") then
    if full_path:match("^packages/site/test") then
      return true
    else
      return false
    end
  else
    return name ~= "node_modules"
  end
end
```

## Troubleshooting

[`testDir`](https://playwright.dev/docs/api/class-testconfig#test-config-test-dir) should be defined in `playwright.config.ts`.

## Credits

- [neotest-jest](https://github.com/haydenmeade/neotest-jest)
