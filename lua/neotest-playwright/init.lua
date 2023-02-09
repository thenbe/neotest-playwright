--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end
-- End of Lua Library inline imports
local ____exports = {}
local logger = require("neotest.logging")
local ____config = require('neotest-playwright.config')
local config = ____config.config
local ____preset = require('neotest-playwright.preset')
local create_preset_command = ____preset.create_preset_command
local ____project = require('neotest-playwright.project')
local create_project_command = ____project.create_project_command
create_preset_command()
create_project_command()
____exports.adapter = config
setmetatable(
    ____exports.adapter,
    {__call = function(self, arg)
        logger.debug("neotest-playwright adapter()", arg)
        config.options = __TS__ObjectAssign({}, config.options, arg.options)
        return ____exports.adapter
    end}
)
return ____exports
