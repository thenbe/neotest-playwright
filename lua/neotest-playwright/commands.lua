--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local async = require("neotest.async")
local lib = require("neotest.lib")
local ____discover = require('neotest-playwright.discover')
local refresh_data = ____discover.refresh_data
local function refresh_command()
    if lib.subprocess.enabled() then
        lib.subprocess.call("require('neotest-playwright.discover').refresh_data")
    else
        refresh_data()
    end
end
____exports.create_refresh_command = function()
    vim.api.nvim_create_user_command(
        "NeotestPlaywrightRefresh",
        function()
            async.run(refresh_command)
        end,
        {nargs = 0}
    )
end
return ____exports
