# neotest-playwright

A [playwright](https://playwright.dev/) adapter for [neotest](https://github.com/nvim-neotest/neotest).

Written in typescript and transpiled to Lua using [tstl](https://github.com/TypeScriptToLua/TypeScriptToLua).

## Installation

> ⚠️ This adapter is very much a work in progress and is not yet ready for public use.

Using packer:

```lua
use({
  'nvim-neotest/neotest',
  requires = {
    ...,
    'thenbe/neotest-playwright',
  }
  config = function()
    require('neotest').setup({
      ...,
      adapters = {
        require('neotest-playwright').adapter
      }
    })
  end
})
```

# Credits

- [neotest-jest](https://github.com/haydenmeade/neotest-jest)
