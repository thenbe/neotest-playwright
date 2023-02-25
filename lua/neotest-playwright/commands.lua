--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local logger = require("neotest.logging")
local ____discover = require('neotest-playwright.discover')
local refresh_data = ____discover.refresh_data
____exports.create_refresh_command = function()
    vim.api.nvim_create_user_command(
        "NeotestPlaywrightRefresh",
        function()
            logger.debug("NeotestPlaywrightRefresh")
            refresh_data()
        end,
        {nargs = 0}
    )
end
return ____exports
