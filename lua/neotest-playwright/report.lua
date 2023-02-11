--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0") or _VERSION == "Lua 5.1"
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (tostring(description) .. "\n") .. self.stack
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_2 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, self.constructor.new)
        local metatable = getmetatable(self)
        if not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        local ____temp_1
        if self.message ~= "" then
            ____temp_1 = (self.name .. ": ") .. self.message
        else
            ____temp_1 = self.name
        end
        return ____temp_1
    end
    Error = ____initErrorClass_2(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_4 = initErrorClass
        local ____class_3 = __TS__Class()
        ____class_3.name = ____class_3.name
        __TS__ClassExtends(____class_3, Error)
        function ____class_3.prototype.____constructor(self, ...)
            ____class_3.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_4(nil, ____class_3, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

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
____exports.decodeOutput = function(data)
    local ok, parsed = pcall(vim.json.decode, data, {luanil = {object = true}})
    if not ok then
        logger.error("Failed to parse test output json")
        error(
            __TS__New(Error, "Failed to parse test output json"),
            0
        )
    end
    return parsed
end
____exports.parseOutput = function(report, output)
    if #report.errors > 1 then
        logger.warn("Global errors found in report", report.errors)
    end
    local root = report.suites[1]
    if not root then
        logger.warn("No test suites found in report")
        error(
            __TS__New(Error, "No test suites found in report"),
            0
        )
    end
    local results = ____exports.parseSuite(root, report, output)
    return results
end
____exports.parseSuite = function(suite, report, output)
    local results = {}
    for ____, spec in ipairs(suite.specs) do
        local key = constructSpecKey(report, spec, suite)
        local specResults = ____exports.parseSpec(spec)
        results[key] = specResults
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
constructSpecKey = function(report, spec, suite)
    local dir = report.config.rootDir
    local file = spec.file
    local name = spec.title
    local suiteName = suite.title
    local isPartOfDescribe = suiteName ~= file
    local key
    if isPartOfDescribe then
        key = (((((dir .. "/") .. file) .. "::") .. suiteName) .. "::") .. name
    else
        key = (((dir .. "/") .. file) .. "::") .. name
    end
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
