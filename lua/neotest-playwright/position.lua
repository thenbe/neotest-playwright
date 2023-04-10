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

local function __TS__ArrayFilter(self, callbackfn, thisArg)
    local result = {}
    local len = 0
    for i = 1, #self do
        if callbackfn(thisArg, self[i], i - 1, self) then
            len = len + 1
            result[len] = self[i]
        end
    end
    return result
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

local function __TS__ArrayIncludes(self, searchElement, fromIndex)
    if fromIndex == nil then
        fromIndex = 0
    end
    local len = #self
    local k = fromIndex
    if fromIndex < 0 then
        k = len + fromIndex
    end
    if k < 0 then
        k = 0
    end
    for i = k + 1, len do
        if self[i] == searchElement then
            return true
        end
    end
    return false
end

local function __TS__ArrayMap(self, callbackfn, thisArg)
    local result = {}
    for i = 1, #self do
        result[i] = callbackfn(thisArg, self[i], i - 1, self)
    end
    return result
end

local function __TS__ObjectRest(target, usedProperties)
    local result = {}
    for property in pairs(target) do
        if not usedProperties[property] then
            result[property] = target[property]
        end
    end
    return result
end
-- End of Lua Library inline imports
local ____exports = {}
local specToPosition
local ____adapter_2Ddata = require('neotest-playwright.adapter-data')
local data = ____adapter_2Ddata.data
local ____adapter_2Doptions = require('neotest-playwright.adapter-options')
local options = ____adapter_2Doptions.options
local ____helpers = require('neotest-playwright.helpers')
local emitError = ____helpers.emitError
local ____logging = require('neotest-playwright.logging')
local logger = ____logging.logger
--- Given a test position, return one or more positions based on what can be
-- dynamically discovered using the playwright cli.
____exports.buildTestPosition = function(basePosition)
    local line = basePosition.range[1]
    if not data.specs then
        error(
            __TS__New(Error, "No specs found"),
            0
        )
    end
    local specs = __TS__ArrayFilter(
        data.specs,
        function(____, spec)
            local specAbsolutePath = (tostring(data.rootDir) .. "/") .. spec.file
            local fileMatch = specAbsolutePath == basePosition.path
            if not fileMatch then
                return false
            end
            local rowMatch = spec.line == line + 1
            local match = rowMatch and fileMatch
            return match
        end
    )
    if #specs == 0 then
        logger("debug", "No match found")
        return {basePosition}
    end
    local projects = options.projects
    local positions = {}
    --- The parent of the range-less positions
    local main = __TS__ObjectAssign({}, basePosition)
    positions[#positions + 1] = main
    __TS__ArrayMap(
        specs,
        function(____, spec)
            local position = specToPosition(spec, basePosition)
            if #options.projects == 0 then
                positions[#positions + 1] = position
                return
            else
                local projectId = position.project_id
                if not projectId then
                    local msg = "No project id found for position: " .. position.name
                    emitError(msg)
                    error(
                        __TS__New(Error, msg),
                        0
                    )
                end
                if __TS__ArrayIncludes(projects, projectId) then
                    positions[#positions + 1] = position
                end
            end
        end
    )
    return positions
end
--- Convert a playwright spec to a neotest position.
specToPosition = function(spec, basePosition)
    local ____opt_0 = spec.tests[1]
    local projectId = ____opt_0 and ____opt_0.projectName
    if not projectId then
        local msg = "No project id found for spec: " .. spec.title
        emitError(msg)
        error(
            __TS__New(Error, msg),
            0
        )
    end
    local ____basePosition_2 = basePosition
    local range = ____basePosition_2.range
    local rest = __TS__ObjectRest(____basePosition_2, {range = true})
    local position = __TS__ObjectAssign({}, rest, {id = spec.id, name = projectId, project_id = projectId})
    return position
end
return ____exports
