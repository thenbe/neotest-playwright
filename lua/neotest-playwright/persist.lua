--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local logger = require("neotest.logging")
--- Persists the selected projects to disk. Project selection is scoped
-- to project directory.
____exports.saveConfig = function(data)
    local dataPath = vim.fn.stdpath("data")
    local dataFile = dataPath .. "/neotest-playwright.json"
    local existing = vim.fn.readfile(dataFile)
    local ____temp_0
    if #existing > 0 then
        ____temp_0 = vim.fn.json_decode(existing[1])
    else
        ____temp_0 = {}
    end
    local existingData = ____temp_0
    local path = vim.fn.getcwd()
    existingData[path] = data
    logger.info("neotest-playwright save(): Saving data to", dataFile)
    vim.fn.writefile(
        {vim.fn.json_encode(existingData)},
        dataFile
    )
end
return ____exports
