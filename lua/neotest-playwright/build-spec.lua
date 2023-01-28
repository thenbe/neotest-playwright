--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
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
local getBinary, getConfig
local util = require("neotest-playwright.util")
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
    local binary = getBinary(pos.path)
    local config = getConfig(pos.path)
    local command = {binary, "test", "--reporter=json"}
    if config and lib.files.exists(config) then
        command[#command + 1] = "--config=" .. config
    end
    local testFilter = (pos.type == "test" or pos.type == "namespace") and (pos.path .. ":") .. tostring(pos.range[1] + 1) or pos.path
    command[#command + 1] = testFilter
    if args.extra_args then
        __TS__ArrayPushArray(command, args.extra_args)
    end
    local resultsPath = async.fn.tempname() .. ".json"
    lib.files.write(resultsPath, "")
    local streamData, stopStream = lib.files.stream(resultsPath)
    print(vim.inspect(command))
    return {
        command = command,
        cwd = nil,
        context = {results_path = resultsPath, file = pos.path, stop_stream = stopStream},
        stream = function() return function()
            local newResults = streamData()
            local json = vim.json
            local ok, report = pcall(json.decode, newResults, {luanil = {object = true}})
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
