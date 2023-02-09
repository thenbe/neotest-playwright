--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____adapter = require('neotest-playwright.adapter')
local createAdapter = ____adapter.createAdapter
local ____preset = require('neotest-playwright.preset')
local create_preset_command = ____preset.create_preset_command
create_preset_command()
____exports.adapter = createAdapter()
setmetatable(
    ____exports.adapter,
    {__call = function(self, config)
        if config.debug then
            print("neotest-playwright config:")
            print(vim.inspect(config, {}))
        end
        local updated = createAdapter(config)
        return updated
    end}
)
return ____exports
