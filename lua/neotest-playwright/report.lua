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
                return (description .. "\n") .. tostring(self.stack)
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
    local ____initErrorClass_1 = initErrorClass
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
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
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

local function __TS__ArrayIsArray(value)
    return type(value) == "table" and (value[1] ~= nil or next(value) == nil)
end

local function __TS__ArrayConcat(self, ...)
    local items = {...}
    local result = {}
    local len = 0
    for i = 1, #self do
        len = len + 1
        result[len] = self[i]
    end
    for i = 1, #items do
        local item = items[i]
        if __TS__ArrayIsArray(item) then
            for j = 1, #item do
                len = len + 1
                result[len] = item[j]
            end
        else
            len = len + 1
            result[len] = item
        end
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
local ____adapter_2Doptions = require('neotest-playwright.adapter-options')
local options = ____adapter_2Doptions.options
local ____helpers = require('neotest-playwright.helpers')
local emitError = ____helpers.emitError
____exports.decodeOutput = function(data)
    local ok, parsed = pcall(vim.json.decode, data, {luanil = {object = true}})
    if not ok then
        emitError("Failed to parse test output json")
        error(
            __TS__New(Error, "Failed to parse test output json"),
            0
        )
    end
    return parsed
end
____exports.parseOutput = function(report)
    if #report.errors > 1 then
        emitError("Global errors found in report")
    end
    local root = report.suites[1]
    if not root then
        emitError("No test suites found in report")
        return {}
    end
    local results = ____exports.parseSuite(root, report)
    return results
end
____exports.parseSuite = function(suite, report)
    local results = {}
    local specs = ____exports.flattenSpecs({suite})
    for ____, spec in ipairs(specs) do
        local key
        if options.enable_dynamic_test_discovery then
            key = spec.id
        else
            key = constructSpecKey(report, spec)
        end
        results[key] = ____exports.parseSpec(spec)
    end
    return results
end
____exports.flattenSpecs = function(suites)
    local specs = {}
    for ____, suite in ipairs(suites) do
        local suiteSpecs = __TS__ArrayMap(
            suite.specs,
            function(____, spec) return __TS__ObjectAssign({}, spec, {suiteTitle = suite.title}) end
        )
        specs = __TS__ArrayConcat(
            specs,
            suiteSpecs,
            ____exports.flattenSpecs(suite.suites or ({}))
        )
    end
    return specs
end
____exports.parseSpec = function(spec)
    local status = getSpecStatus(spec)
    local errors = __TS__ArrayMap(
        collectSpecErrors(spec),
        function(____, s) return toNeotestError(s) end
    )
    local ____opt_2 = spec.tests[1]
    local ____opt_0 = ____opt_2 and ____opt_2.results[1]
    local attachments = ____opt_0 and ____opt_0.attachments or ({})
    local data = {status = status, short = (spec.title .. ": ") .. status, errors = errors, attachments = attachments}
    return data
end
getSpecStatus = function(spec)
    if not spec.ok then
        return "failed"
    else
        local ____opt_4 = spec.tests[1]
        if (____opt_4 and ____opt_4.status) == "skipped" then
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
    local ____opt_6 = ____error.location
    local line = ____opt_6 and ____opt_6.line
    return {
        message = cleanAnsi(____error.message),
        line = line and line - 1 or 0
    }
end
return ____exports
