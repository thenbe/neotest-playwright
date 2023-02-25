--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__StringEndsWith(self, searchString, endPosition)
    if endPosition == nil or endPosition > #self then
        endPosition = #self
    end
    return string.sub(self, endPosition - #searchString + 1, endPosition) == searchString
end

local function __TS__ArraySome(self, callbackfn, thisArg)
    for i = 1, #self do
        if callbackfn(thisArg, self[i], i - 1, self) then
            return true
        end
    end
    return false
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
-- End of Lua Library inline imports
local ____exports = {}
local lib = require("neotest.lib")
local logger = require("neotest.logging")
local ____adapter_2Ddata = require('neotest-playwright.adapter-data')
local data = ____adapter_2Ddata.data
local ____adapter_2Doptions = require('neotest-playwright.adapter-options')
local options = ____adapter_2Doptions.options
local ____playwright = require('neotest-playwright.playwright')
local getTests = ____playwright.getTests
local ____position = require('neotest-playwright.position')
local buildTestPosition = ____position.buildTestPosition
local ____report = require('neotest-playwright.report')
local flattenSpecs = ____report.flattenSpecs
____exports.root = lib.files.match_root_pattern("package.json")
____exports.filterDir = function(name, _rel_path, _root)
    return name ~= "node_modules"
end
____exports.isTestFile = function(file_path)
    if not file_path then
        return false
    end
    local endings = {".spec.ts", ".test.ts", ".spec.js", ".test.js"}
    local result = __TS__ArraySome(
        endings,
        function(____, ending) return __TS__StringEndsWith(file_path, ending) end
    )
    return result
end
____exports.discoverPositions = function(path)
    local query = "\n\t\t; -- Namespaces --\n\n\t\t; Matches: test.describe('title')\n\n\t\t(call_expression\n\t\t function: (member_expression) @func_name (#eq? @func_name \"test.describe\")\n\n\t\t arguments: (arguments\n\t\t\t (string (string_fragment) @namespace.name)\n\t\t\t ) @namespace.definition\n\t\t )\n\n\t\t; -- Tests --\n\n\t\t; Matches: test('title')\n\n\t\t(call_expression\n\t\t function: (identifier) @func_name (#eq? @func_name \"test\")\n\n\t\t arguments: (arguments\n\t\t\t(string (string_fragment) @test.name\n\t\t\t)\n\t\t\t) @test.definition\n\t\t)\n\n\t\t; Matches: test.only('title') / test.fixme('title')\n\n\t\t(call_expression\n\t\t function: (member_expression) @func_name (#any-of? @func_name \"test.only\" \"test.fixme\" \"test.skip\")\n\n\t\t arguments: (arguments\n\t\t\t(string (string_fragment) @test.name)\n\t\t\t) @test.definition\n\t\t)\n\t\t"
    return lib.treesitter.parse_positions(
        path,
        query,
        __TS__ObjectAssign({nested_tests = true, position_id = "require(\"neotest-playwright.discover\")._position_id"}, options.enable_dynamic_test_discovery and ({build_position = "require(\"neotest-playwright.discover\")._build_position"}) or ({}))
    )
end
local function getMatchType(node)
    if node["test.name"] ~= nil then
        return "test"
    elseif node["namespace.name"] ~= nil then
        return "namespace"
    else
        error(
            __TS__New(Error, "Unknown match type"),
            0
        )
    end
end
____exports._build_position = function(filePath, source, capturedNodes)
    local match_type = getMatchType(capturedNodes)
    local name = vim.treesitter.get_node_text(capturedNodes[match_type .. ".name"], source)
    local definition = capturedNodes[match_type .. ".definition"]
    local range = {definition:range()}
    if match_type == "namespace" then
        return {type = match_type, range = range, path = filePath, name = name}
    elseif match_type == "test" then
        local base = {type = match_type, range = range, path = filePath, name = name}
        local position = buildTestPosition(base)
        return position
    else
        error(
            __TS__New(Error, "Unknown match type"),
            0
        )
    end
end
____exports._position_id = function(position, _parent)
    return position.id or position.path .. position.name
end
____exports._get_data = function()
    logger.debug("======getting data=======")
    if data.specs and data.rootDir then
        logger.debug("data already exists")
    else
        logger.debug("======data does not exist. refreshing...=======")
        local report = getTests()
        logger.debug("report", report)
        data.report = report
        data.specs = flattenSpecs(report.suites)
        data.rootDir = report.config.rootDir
    end
    return {report = data.report, specs = data.specs, rootDir = data.rootDir}
end
return ____exports
