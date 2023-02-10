--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local run
local logger = require("neotest.logging")
____exports.get_projects = function()
    local testFilter = "./does-not-exist"
    local cmd = ("npx playwright test --list --reporter=json " .. testFilter) .. " "
    local output = run(cmd)
    return output
end
--- Returns the playwright config
run = function(cmd)
    local handle, errmsg = io.popen(cmd)
    if type(errmsg) == "string" then
        logger.error(errmsg)
    end
    if not handle then
        logger.error("Failed to execute command: " .. cmd)
        return
    end
    local output = handle:read("*a")
    handle:close()
    if type(output) ~= "string" then
        logger.error("Failed to read output from command: " .. cmd)
        return
    end
    if output == "" then
        logger.error("No output from command: " .. cmd)
        return
    end
    local parsed = vim.fn.json_decode(output)
    return parsed
end
return ____exports
