--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__StringStartsWith(self, searchString, position)
    if position == nil or position < 0 then
        position = 0
    end
    return string.sub(self, position + 1, #searchString + position) == searchString
end

local function __TS__ArrayFind(self, predicate, thisArg)
    for i = 1, #self do
        local elem = self[i]
        if predicate(thisArg, elem, i - 1, self) then
            return elem
        end
    end
    return nil
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
-- End of Lua Library inline imports
local ____exports = {}
local getBinary, getConfig
local util = require("neotest-playwright.util")
local ____build_2Dcommand = require("neotest-playwright/build-command")
local buildCommand = ____build_2Dcommand.buildCommand
local COMMAND_PRESETS = ____build_2Dcommand.COMMAND_PRESETS
local ____report = require("neotest-playwright/report")
local parseOutput = ____report.parseOutput
local async = require("neotest.async")
local lib = require("neotest.lib")
____exports.buildSpec = function(args)
    if not args then
        print("No args")
        return
    end
    if not args.tree then
        print("No args.tree")
        return
    end
    local pos = args.tree:data()
    local testFilter = (pos.type == "test" or pos.type == "namespace") and (pos.path .. ":") .. tostring(pos.range[1] + 1) or pos.path
    local binary = getBinary(pos.path)
    local config = getConfig(pos.path)
    local ____opt_0 = args.extra_args
    local presetName = ____opt_0 and __TS__ArrayFind(
        args.extra_args,
        function(____, x) return __TS__StringStartsWith(x, "preset=") end
    )
    local preset = presetName == "preset=headed" and COMMAND_PRESETS.COMMAND_HEADED or COMMAND_PRESETS.COMMAND_DEFAULT
    local commandOptions = __TS__ObjectAssign({}, preset, {testFilter = testFilter})
    if config and lib.files.exists(config) then
        commandOptions.config = config
    end
    local resultsPath = async.fn.tempname() .. ".json"
    local command = {
        binary,
        unpack(buildCommand(commandOptions))
    }
    print(vim.inspect(command))
    lib.files.write(resultsPath, "")
    local streamData, stopStream = lib.files.stream(resultsPath)
    return {
        command = command,
        cwd = nil,
        context = {results_path = resultsPath, file = pos.path, stop_stream = stopStream},
        stream = function() return function()
            local newResults = streamData()
            local ok, report = pcall(vim.json.decode, newResults, {luanil = {object = true}})
            if not ok then
                print("Error parsing results")
                print(newResults)
                return {}
            end
            return parseOutput(report, resultsPath)
        end end,
        env = {PLAYWRIGHT_JSON_OUTPUT_NAME = resultsPath}
    }
end
getBinary = function(filePath)
    print("getBinary", filePath)
    local node_modules = tostring(util.find_ancestor(filePath, "node_modules", true)) .. "/node_modules"
    local bin = node_modules .. "/.bin/playwright"
    if lib.files.exists(bin) then
        return bin
    else
        return "pnpm playwright"
    end
end
getConfig = function(filePath)
    local configDir = util.find_ancestor(filePath, "playwright.config.ts", false)
    local config = tostring(configDir) .. "/playwright.config.ts"
    if lib.files.exists(config) then
        return config
    end
    print("Unable to locate config file.", config)
    return nil
end
return ____exports
