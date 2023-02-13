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
            -- ...,
            options = {
               persist_project_selection = false,

               -- get_playwright_command = function(file_path)
               --    return "path/to/playwright-binary"
               -- end,

               -- get_playwright_config = function(file_path)
               --    return "path/to/playwright.config.ts"
               -- end,

               -- get_cwd = function(file_path)
               --    return "path/to/dir"
               -- end,

               -- env = {
               --    PW_NVIM = "1",
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

## Configuration

The only reporter required by `neotest-playwright` is the `json` reporter, which you need to set either in your `playwright.config.ts` or by using `extra_args`. Make sure _not_ to declare the json reporter's `outputFile` property in your config as this will be set by `neotest-playwright`.

One way you can do this is by using environment variables.

```lua
-- init.lua

require("neotest-playwright").adapter({
   options = {
      env = {
         PW_NVIM = "1",
      },
   },
})
```

```typescript
// playwright.config.ts

const config: PlaywrightTestConfig = {
	reporter: process.env.PW_NVIM
		? [['json'], ['list'], ['html', { open: 'never' }]] // only json is required. The rest are optional.
		: [['list'], ['html', { open: 'never' }]], // Your default reporters.
};
```

> Until `playwright` provides us a way to pass the `--reporters` flag without overwriting the `reporters` set in the user's config, we have to rely on the user handling this.

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
