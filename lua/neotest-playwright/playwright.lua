--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local run
local logger = require("neotest.logging")
local ____adapter_2Doptions = require('neotest-playwright.adapter-options')
local options = ____adapter_2Doptions.options
local ____build_2Dcommand = require('neotest-playwright.build-command')
local buildCommand = ____build_2Dcommand.buildCommand
____exports.get_projects = function()
    local filePath = vim.fn.expand("%:p")
    local cmd = buildCommand(
        {
            bin = options.get_playwright_command(filePath),
            config = options.get_playwright_config(filePath),
            testFilter = "./does-not-exist"
        },
        {"--list"}
    )
    local output = run(table.concat(cmd, " "))
    return output
end
--- Returns the playwright config
run = function(cmd)
    local handle, errmsg = io.popen(cmd)
    if type(errmsg) == "string" then
        logger.error(errmsg)
    end
    if not handle then
        logger.error("Failed to execute command: " .. cmd)
        return
    end
    local output = handle:read("*a")
    handle:close()
    if type(output) ~= "string" then
        logger.error("Failed to read output from command: " .. cmd)
        return
    end
    if output == "" then
        logger.error("No output from command: " .. cmd)
        return
    end
    local parsed = vim.fn.json_decode(output)
    return parsed
end
return ____exports
