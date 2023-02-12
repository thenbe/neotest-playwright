--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____report = require('neotest-playwright.report')
local parseOutput = ____report.parseOutput
local ____report_2Dio = require('neotest-playwright.report-io')
local readReport = ____report_2Dio.readReport
____exports.results = function(spec, result, _tree)
    local resultsPath = spec.context.results_path
    local decoded = readReport(resultsPath, result)
    local results = parseOutput(decoded)
    return results
end
return ____exports
