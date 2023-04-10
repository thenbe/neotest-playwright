--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local lib = require("neotest.lib")
local ____logging = require('neotest-playwright.logging')
local logger = ____logging.logger
local current = vim.fn.getcwd()
local dataPath = vim.fn.stdpath("data")
local dataFile = dataPath .. "/neotest-playwright.json"
____exports.loadCache = function()
    logger("debug", "Loading cache", dataFile)
    if not lib.files.exists(dataFile) then
        return nil
    end
    local existing = vim.fn.readfile(dataFile)
    if #existing == 0 then
        return nil
    end
    local cache = vim.fn.json_decode(existing[1])
    return cache
end
--- Persists the selected projects to disk. Project selection is scoped
-- to project directory.
____exports.saveCache = function(cache)
    logger("debug", "Saving cache", dataFile)
    vim.fn.writefile(
        {vim.fn.json_encode(cache)},
        dataFile
    )
end
____exports.loadProjectCache = function()
    local cache = ____exports.loadCache()
    if cache == nil then
        return nil
    end
    local projectCache = cache[current] or nil
    logger("debug", "Loading Project Cache", projectCache)
    return projectCache
end
____exports.saveProjectCache = function(latest)
    logger("debug", "Saving Project Cache", latest)
    local cache = ____exports.loadCache() or ({})
    cache[current] = latest
    ____exports.saveCache(cache)
end
return ____exports
