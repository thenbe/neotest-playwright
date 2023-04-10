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
local ____adapter_2Doptions = require('neotest-playwright.adapter-options')
local options = ____adapter_2Doptions.options
local ____commands = require('neotest-playwright.commands')
local create_refresh_command = ____commands.create_refresh_command
local ____config = require('neotest-playwright.config')
local config = ____config.config
local ____logging = require('neotest-playwright.logging')
local logger = ____logging.logger
local ____preset = require('neotest-playwright.preset')
local create_preset_command = ____preset.create_preset_command
local ____project = require('neotest-playwright.project')
local create_project_command = ____project.create_project_command
local loadPreselectedProjects = ____project.loadPreselectedProjects
create_preset_command()
create_project_command()
create_refresh_command()
____exports.adapter = config
setmetatable(
    ____exports.adapter,
    {__call = function(self, arg)
        logger("debug", "config", arg)
        local userOptions = {}
        if arg and type(arg) == "table" and arg.options ~= nil then
            local ____arg_options_0 = arg.options
            if ____arg_options_0 == nil then
                ____arg_options_0 = {}
            end
            userOptions = ____arg_options_0
        end
        local updated = __TS__ObjectAssign({}, config.options, userOptions)
        for key, value in pairs(updated) do
            config.options[key] = value
        end
        if options.persist_project_selection then
            local projects = loadPreselectedProjects()
            if projects then
                options.projects = projects
            end
        end
        logger("debug", "options", options)
        return ____exports.adapter
    end}
)
return ____exports
