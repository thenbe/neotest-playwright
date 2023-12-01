--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____adapter_2Doptions = require('neotest-playwright.adapter-options')
local options = ____adapter_2Doptions.options
local ____logging = require('neotest-playwright.logging')
local logger = ____logging.logger
local ____preset_2Doptions = require('neotest-playwright.preset-options')
local isPreset = ____preset_2Doptions.isPreset
____exports.set_preset = function(preset)
    options.preset = preset
end
____exports.select_preset = function(on_submit)
    local choices = {"headed", "debug", "none"}
    local prompt = "Select preset for neotest-playwright:"
    local choice
    vim.ui.select(
        choices,
        {prompt = prompt},
        function(c)
            choice = c
            logger("debug", "preset", choice)
            if isPreset(choice) then
                on_submit(choice)
            end
        end
    )
end
____exports.create_preset_command = function()
    vim.api.nvim_create_user_command(
        "NeotestPlaywrightPreset",
        function() return ____exports.select_preset(function(choice) return ____exports.set_preset(choice) end) end,
        {nargs = 0}
    )
end
return ____exports
