--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____report = require('neotest-playwright.report')
local parseOutput = ____report.parseOutput
local ____logging = require('neotest-playwright.logging')
local logger = ____logging.logger
local ____report_2Dio = require('neotest-playwright.report-io')
local readReport = ____report_2Dio.readReport
____exports.results = function(spec, result, _tree)
    if result.code == 129 then
        logger("debug", "Code 129: User stopped the test run. Aborting result parse")
        return {}
    end
    local resultsPath = spec.context.results_path
    local decoded = readReport(resultsPath)
    local results = parseOutput(decoded)
    return results
end
return ____exports
