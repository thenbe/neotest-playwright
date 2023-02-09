--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local run
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
        vim.notify(errmsg, vim.log.levels.ERROR, {})
    end
    if not handle then
        vim.notify("Failed to execute command: " .. cmd, vim.log.levels.ERROR, {})
        return
    end
    local output = handle:read("*a")
    handle:close()
    if type(output) ~= "string" then
        vim.notify("Failed to read output from command: " .. cmd, vim.log.levels.ERROR, {})
        return
    end
    if output == "" then
        vim.notify("No output from command: " .. cmd, vim.log.levels.ERROR, {})
        return
    end
    local parsed = vim.fn.json_decode(output)
    return parsed
end
return ____exports
