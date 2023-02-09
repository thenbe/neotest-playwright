--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____config = require('neotest-playwright.config')
local config = ____config.config
local ____preset = require('neotest-playwright.preset')
local create_preset_command = ____preset.create_preset_command
create_preset_command()
____exports.adapter = config
setmetatable(
    ____exports.adapter,
    {__call = function(self, arg)
        print("neotest-playwright config:")
        print(vim.inspect(arg, {}))
        return ____exports.adapter
    end}
)
return ____exports
