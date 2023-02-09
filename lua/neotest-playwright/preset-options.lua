--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__ObjectValues(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = obj[key]
    end
    return result
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
-- End of Lua Library inline imports
local ____exports = {}
____exports.PRESET = {HEADED = "headed", DEBUG = "debug", NONE = "none"}
____exports.isPreset = function(x)
    return __TS__ArrayIncludes(
        __TS__ObjectValues(____exports.PRESET),
        x
    )
end
local COMMAND_HEADED = {
    headed = true,
    retries = 0,
    abortOnFailure = true,
    workers = 1,
    timeout = 0
}
local COMMAND_DEBUG = {debug = true}
--- No preset, use default options.
____exports.COMMAND_NONE = {}
____exports.COMMAND_PRESETS = {headed = COMMAND_HEADED, debug = COMMAND_DEBUG, none = ____exports.COMMAND_NONE}
return ____exports
