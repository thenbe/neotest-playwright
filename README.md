# neotest-playwright

A [playwright](https://playwright.dev/) adapter for [neotest](https://github.com/nvim-neotest/neotest).

Written in typescript and transpiled to Lua using [tstl](https://github.com/TypeScriptToLua/TypeScriptToLua).

## Installation

> ⚠️ This adapter is very much a work in progress and is not yet ready for public use.

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
            preset = "headless",
         }),
      },
   })
   end,
})
```

## Presets

Presets can be used to debug your tests on the fly.

To select a preset, use the `:NeotestPlaywrightPreset` command.

### `headed`

Runs tests in headed mode. Use with `await page.pause()` to open the playwright inspector and debug your locators.

Applies the following options:
`--headed --retries 0 --timeout 0 --workers 1 --max-failures 0`

### `debug`

Applies the following option: `--debug`

> Playwright uses the `--debug` flag as a shortcut for multiple options. See [here](https://playwright.dev/docs/test-cli#reference) for more information.

### `none`

Clears preset options.

# Credits

- [neotest-jest](https://github.com/haydenmeade/neotest-jest)
