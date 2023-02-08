--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____report = require('neotest-playwright.report')
local parseOutput = ____report.parseOutput
local lib = require("neotest.lib")
____exports.results = function(spec, _result, _tree)
    local ____opt_0 = spec.context
    if ____opt_0 ~= nil then
        ____opt_0:stop_stream()
    end
    local ____opt_2 = spec.context
    local resultsPath = ____opt_2 and ____opt_2.results_path
    local success, data = pcall(lib.files.read, resultsPath)
    if not success then
        print("No test output file found", resultsPath)
        return {}
    end
    local ok, parsed = pcall(vim.json.decode, data, {luanil = {object = true}})
    if not ok then
        print("Failed to parse test output json", resultsPath)
        return {}
    end
    local results = parseOutput(parsed, resultsPath)
    return results
end
return ____exports
