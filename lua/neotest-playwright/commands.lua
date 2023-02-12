--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local logger = require("neotest.logging")
local ____adapter_2Doptions = require('neotest-playwright.adapter-options')
local options = ____adapter_2Doptions.options
local ____playwright = require('neotest-playwright.playwright')
local getTests = ____playwright.getTests
local ____report_2Dio = require('neotest-playwright.report-io')
local writeReport = ____report_2Dio.writeReport
____exports.create_refresh_command = function()
    vim.api.nvim_create_user_command(
        "NeotestPlaywrightRefresh",
        function()
            logger.debug("NeotestPlaywrightRefresh")
            local output = getTests()
            logger.debug("NeotestPlaywrightRefresh saving output +++++++++++++++++++", options.tempDataFile)
            if output ~= nil then
                writeReport(options.tempDataFile, output)
            else
                logger.error("NeotestPlaywrightRefresh failed to get output")
                vim.notify("Failed to get output", vim.log.levels.ERROR, {})
            end
        end,
        {nargs = 0}
    )
end
return ____exports
