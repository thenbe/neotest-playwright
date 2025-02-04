--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local __TS__StringSplit
do
    local sub = string.sub
    local find = string.find
    function __TS__StringSplit(source, separator, limit)
        if limit == nil then
            limit = 4294967295
        end
        if limit == 0 then
            return {}
        end
        local result = {}
        local resultIndex = 1
        if separator == nil or separator == "" then
            for i = 1, #source do
                result[resultIndex] = sub(source, i, i)
                resultIndex = resultIndex + 1
            end
        else
            local currentPos = 1
            while resultIndex <= limit do
                local startPos, endPos = find(source, separator, currentPos, true)
                if not startPos then
                    break
                end
                result[resultIndex] = sub(source, currentPos, startPos - 1)
                resultIndex = resultIndex + 1
                currentPos = endPos + 1
            end
            if resultIndex <= limit then
                result[resultIndex] = sub(source, currentPos)
            end
        end
        return result
    end
end

local __TS__StringReplaceAll
do
    local sub = string.sub
    local find = string.find
    function __TS__StringReplaceAll(source, searchValue, replaceValue)
        if type(replaceValue) == "string" then
            local concat = table.concat(
                __TS__StringSplit(source, searchValue),
                replaceValue
            )
            if #searchValue == 0 then
                return (replaceValue .. concat) .. replaceValue
            end
            return concat
        end
        local parts = {}
        local partsIndex = 1
        if #searchValue == 0 then
            parts[1] = replaceValue(nil, "", 0, source)
            partsIndex = 2
            for i = 1, #source do
                parts[partsIndex] = sub(source, i, i)
                parts[partsIndex + 1] = replaceValue(nil, "", i, source)
                partsIndex = partsIndex + 2
            end
        else
            local currentPos = 1
            while true do
                local startPos, endPos = find(source, searchValue, currentPos, true)
                if not startPos then
                    break
                end
                parts[partsIndex] = sub(source, currentPos, startPos - 1)
                parts[partsIndex + 1] = replaceValue(nil, searchValue, startPos - 1, source)
                partsIndex = partsIndex + 2
                currentPos = endPos + 1
            end
            parts[partsIndex] = sub(source, currentPos)
        end
        return table.concat(parts)
    end
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
-- End of Lua Library inline imports
local ____exports = {}
local getExtraArgs
local ____build_2Dcommand = require('neotest-playwright.build-command')
local buildCommand = ____build_2Dcommand.buildCommand
local async = require("neotest.async")
local ____adapter_2Doptions = require('neotest-playwright.adapter-options')
local options = ____adapter_2Doptions.options
local ____preset_2Doptions = require('neotest-playwright.preset-options')
local COMMAND_PRESETS = ____preset_2Doptions.COMMAND_PRESETS
____exports.buildSpec = function(args)
    local pos = args.tree:data()
    local testFilter
    if pos.type == "dir" or pos.type == "file" then
        testFilter = pos.path
    else
        local line
        if pos.range ~= nil then
            line = pos.range[1] + 1
        else
            local range = args.tree:closest_value_for("range")
            line = range[1] + 1
        end
        testFilter = (pos.path .. ":") .. tostring(line)
        if vim.fn.has("win32") == 1 then
            testFilter = __TS__StringReplaceAll(testFilter, "\\", "/")
        end
    end
    local projects = pos.project_id and ({pos.project_id}) or options.projects
    local commandOptions = __TS__ObjectAssign(
        {},
        COMMAND_PRESETS[options.preset],
        {
            bin = options.get_playwright_binary(),
            config = options.get_playwright_config(),
            projects = projects,
            testFilter = testFilter
        }
    )
    local resultsPath = async.fn.tempname() .. ".json"
    local extraArgs = getExtraArgs(args.extra_args, options.extra_args)
    return {
        command = buildCommand(commandOptions, extraArgs),
        cwd = type(options.get_cwd) == "function" and options.get_cwd() or nil,
        context = {results_path = resultsPath, file = pos.path},
        env = __TS__ObjectAssign({PLAYWRIGHT_JSON_OUTPUT_NAME = resultsPath}, options.env)
    }
end
getExtraArgs = function(...)
    local args = {...}
    local extraArgs = __TS__ArrayFilter(
        args,
        function(____, arg) return arg ~= nil end
    )
    return __TS__ArrayConcat(
        {},
        unpack(extraArgs)
    )
end
return ____exports
