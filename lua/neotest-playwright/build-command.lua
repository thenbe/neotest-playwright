--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__ArrayMap(self, callbackfn, thisArg)
    local result = {}
    for i = 1, #self do
        result[i] = callbackfn(thisArg, self[i], i - 1, self)
    end
    return result
end

local function __TS__CountVarargs(...)
    return select("#", ...)
end

local function __TS__SparseArrayNew(...)
    local sparseArray = {...}
    sparseArray.sparseLength = __TS__CountVarargs(...)
    return sparseArray
end

local function __TS__SparseArrayPush(sparseArray, ...)
    local args = {...}
    local argsLen = __TS__CountVarargs(...)
    local listLen = sparseArray.sparseLength
    for i = 1, argsLen do
        sparseArray[listLen + i] = args[i]
    end
    sparseArray.sparseLength = listLen + argsLen
end

local function __TS__SparseArraySpread(sparseArray)
    local _unpack = unpack or table.unpack
    return _unpack(sparseArray, 1, sparseArray.sparseLength)
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
-- End of Lua Library inline imports
local ____exports = {}
local logger = require("neotest.logging")
--- A function that takes in CommandOptions and returns a string.
____exports.buildCommand = function(options, extraArgs)
    local o = options
    local ____array_0 = __TS__SparseArrayNew(
        o.bin,
        "test",
        "--reporter=json",
        o.debug and "--debug" or nil,
        o.headed and "--headed" or nil,
        o.retries and "--retries=" .. tostring(o.retries) or nil,
        unpack(extraArgs)
    )
    __TS__SparseArrayPush(
        ____array_0,
        o.abortOnFailure and "-x" or nil,
        o.workers and "--workers=" .. tostring(o.workers) or nil,
        o.timeout and "--timeout=" .. tostring(o.timeout) or nil,
        o.config and "--config=" .. o.config or nil,
        o.projects and table.concat(
            __TS__ArrayMap(
                o.projects,
                function(____, project) return "--project=" .. project end
            ),
            " "
        ) or nil,
        o.testFilter and o.testFilter or nil
    )
    local command = {__TS__SparseArraySpread(____array_0)}
    local filtered = __TS__ArrayFilter(
        command,
        function(____, x)
            return type(x) == "string" and #x > 0
        end
    )
    logger.debug("neotest-playwright command", filtered)
    return filtered
end
return ____exports
