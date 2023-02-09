--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local logger = require("neotest.logging")
local current = vim.fn.getcwd()
local dataPath = vim.fn.stdpath("data")
local dataFile = dataPath .. "/neotest-playwright.json"
____exports.loadCache = function()
    logger.trace("neotest-playwright loadCache(): Loading cache from", dataFile)
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
    logger.trace("neotest-playwright saveCache(): Saving data to", dataFile)
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
    logger.trace("neotest-playwright loadProjectCache():", projectCache)
    return projectCache
end
____exports.saveProjectCache = function(latest)
    logger.trace("neotest-playwright saveProjectCache():", latest)
    local cache = ____exports.loadCache() or ({})
    cache[current] = latest
    ____exports.saveCache(cache)
end
return ____exports
