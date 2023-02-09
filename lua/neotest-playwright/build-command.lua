--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__ArrayMap(self, callbackfn, thisArg)
    local result = {}
    for i = 1, #self do
        result[i] = callbackfn(thisArg, self[i], i - 1, self)
    end
    return result
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
--- A function that takes in CommandOptions and returns a string.
____exports.buildCommand = function(options)
    local o = options
    local command = {
        "test",
        "--reporter=json",
        o.debug and "--debug" or nil,
        o.headed and "--headed" or nil,
        o.retries and "--retries=" .. tostring(o.retries) or nil,
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
    }
    return __TS__ArrayFilter(
        command,
        function(____, x) return x ~= nil end
    )
end
return ____exports
