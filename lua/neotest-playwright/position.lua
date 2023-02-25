--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
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
local logger = require("neotest.logging")
--- Given a test position, return one or more positions based on what can be
-- dynamically discovered using the playwright cli.
____exports.buildTestPosition = function(basePosition, data)
    local line = basePosition.range[1]
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
        logger.debug("No match found")
        return {basePosition}
    end
    local positions = {}
    --- The parent of the range-less positions
    local main = __TS__ObjectAssign({}, basePosition)
    positions[#positions + 1] = main
    __TS__ArrayMap(
        specs,
        function(____, spec)
            local ____temp_0 = #positions + 1
            positions[____temp_0] = specToPosition(spec, basePosition)
            return ____temp_0
        end
    )
    return positions
end
--- Convert a playwright spec to a neotest position.
specToPosition = function(spec, basePosition)
    local ____opt_1 = spec.tests[1]
    local projectId = ____opt_1 and ____opt_1.projectName
    local name = (tostring(projectId) .. " - ") .. spec.title
    local ____basePosition_3 = basePosition
    local range = ____basePosition_3.range
    local rest = __TS__ObjectRest(____basePosition_3, {range = true})
    local position = __TS__ObjectAssign({}, rest, {id = spec.id, name = name, project_id = projectId})
    return position
end
return ____exports
