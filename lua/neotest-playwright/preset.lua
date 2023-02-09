--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local logger = require("neotest.logging")
local ____build_2Dspec = require('neotest-playwright.build-spec')
local buildSpec = ____build_2Dspec.buildSpec
local ____config = require('neotest-playwright.config')
local config = ____config.config
local ____preset_2Doptions = require('neotest-playwright.preset-options')
local isPreset = ____preset_2Doptions.isPreset
____exports.set_preset = function(preset)
    logger.debug("neotest-playwright preset", preset)
    config.build_spec = function(args) return buildSpec(args, preset) end
end
____exports.select_preset = function()
    local options = {"headed", "debug", "none"}
    local prompt = "Select preset for neotest-playwright:"
    local choice
    vim.ui.select(
        options,
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
