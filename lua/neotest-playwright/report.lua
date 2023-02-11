--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__ArrayMap(self, callbackfn, thisArg)
    local result = {}
    for i = 1, #self do
        result[i] = callbackfn(thisArg, self[i], i - 1, self)
    end
    return result
end

local function __TS__ArrayPushArray(self, items)
    local len = #self
    for i = 1, #items do
        len = len + 1
        self[len] = items[i]
    end
    return len
end
-- End of Lua Library inline imports
local ____exports = {}
local getSpecStatus, constructSpecKey, collectSpecErrors, toNeotestError
local ____neotest_2Dplaywright_2Eutil = require("neotest-playwright.util")
local cleanAnsi = ____neotest_2Dplaywright_2Eutil.cleanAnsi
local logger = require("neotest.logging")
____exports.parseOutput = function(report, output)
    if #report.errors > 1 then
        logger.warn("Global errors found in report", report.errors)
    end
    local root = report.suites[1]
    if not root then
        logger.warn("No test suites found in report")
        return {}
    end
    local results = ____exports.parseSuite(root, report, output)
    return results
end
____exports.parseSuite = function(suite, report, output)
    local results = {}
    for ____, spec in ipairs(suite.specs) do
        local key = constructSpecKey(report, spec)
        local specResults = ____exports.parseSpec(spec)
        results[key] = __TS__ObjectAssign({}, specResults, {output = output})
    end
    for ____, child in ipairs(suite.suites or ({})) do
        local childResults = ____exports.parseSuite(child, report, output)
        results = __TS__ObjectAssign({}, results, childResults)
    end
    return results
end
____exports.parseSpec = function(spec)
    local status = getSpecStatus(spec)
    local errors = __TS__ArrayMap(
        collectSpecErrors(spec),
        function(____, s) return toNeotestError(s) end
    )
    local data = {status = status, short = (spec.title .. ": ") .. status, errors = errors}
    return data
end
getSpecStatus = function(spec)
    if not spec.ok then
        return "failed"
    else
        local ____opt_0 = spec.tests[1]
        if (____opt_0 and ____opt_0.status) == "skipped" then
            return "skipped"
        else
            return "passed"
        end
    end
end
constructSpecKey = function(report, spec)
    local dir = report.config.rootDir
    local file = spec.file
    local name = spec.title
    local key = (((dir .. "/") .. file) .. "::") .. name
    return key
end
--- Collect all errors from a spec by traversing spec -> tests[] -> results[].
-- Return a single flat array containing any errors.
collectSpecErrors = function(spec)
    local errors = {}
    for ____, test in ipairs(spec.tests) do
        for ____, result in ipairs(test.results) do
            __TS__ArrayPushArray(errors, result.errors)
        end
    end
    return errors
end
--- Convert Playwright error to neotest error
toNeotestError = function(____error)
    local ____cleanAnsi_result_4 = cleanAnsi(____error.message)
    local ____opt_2 = ____error.location
    return {message = ____cleanAnsi_result_4, line = ____opt_2 and ____opt_2.line or 0}
end
return ____exports
