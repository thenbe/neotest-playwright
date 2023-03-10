--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local logger = require("neotest.logging")
local ____adapter_2Doptions = require('neotest-playwright.adapter-options')
local options = ____adapter_2Doptions.options
local ____preset_2Doptions = require('neotest-playwright.preset-options')
local isPreset = ____preset_2Doptions.isPreset
____exports.set_preset = function(preset)
    logger.debug("neotest-playwright preset", preset)
    options.preset = preset
end
____exports.select_preset = function()
    local choices = {"headed", "debug", "none"}
    local prompt = "Select preset for neotest-playwright:"
    local choice
    vim.ui.select(
        choices,
        {prompt = prompt},
        function(c)
            choice = c
        end
    )
    logger.debug("neotest-playwright preset", choice)
    if isPreset(choice) then
        return choice
    else
        return nil
    end
end
____exports.create_preset_command = function()
    vim.api.nvim_create_user_command(
        "NeotestPlaywrightPreset",
        function()
            local choice = ____exports.select_preset()
            if choice == nil then
                return
            end
            ____exports.set_preset(choice)
        end,
        {nargs = 0}
    )
end
return ____exports
