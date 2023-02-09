--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__ArrayMap(self, callbackfn, thisArg)
    local result = {}
    for i = 1, #self do
        result[i] = callbackfn(thisArg, self[i], i - 1, self)
    end
    return result
end
-- End of Lua Library inline imports
local ____exports = {}
local selectProjects, setProjects
local logger = require("neotest.logging")
local ____adapter_2Doptions = require('neotest-playwright.adapter-options')
local options = ____adapter_2Doptions.options
local ____persist = require('neotest-playwright.persist')
local saveConfig = ____persist.saveConfig
local ____select_2Dmultiple = require('neotest-playwright.select-multiple')
local selectMultiple = ____select_2Dmultiple.selectMultiple
--- Returns the playwright config
local function get_projects()
    local testFilter = "./does-not-exist"
    local cmd = ("npx playwright test --list --reporter=json " .. testFilter) .. " "
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
--- Returns a list of project names
local function parseProjects(output)
    local names = __TS__ArrayMap(
        output.config.projects,
        function(____, p) return p.name end
    )
    return names
end
____exports.create_project_command = function()
    vim.api.nvim_create_user_command(
        "NeotestPlaywrightProject",
        function()
            local output = get_projects()
            local options = parseProjects(output)
            local selection = selectProjects(options)
            setProjects(selection)
        end,
        {nargs = 0}
    )
end
selectProjects = function(options)
    local prompt = "Select projects to include in the next test run:"
    local choice = selectMultiple({prompt = prompt, options = options, initial = "all"})
    logger.debug("neotest-playwright project", choice)
    vim.notify(
        "Selected projects: " .. tostring(vim.inspect(choice, {})),
        vim.log.levels.DEBUG,
        {}
    )
    return choice
end
setProjects = function(projects)
    logger.debug("neotest-playwright project", projects)
    if options.persist_project_selection then
        saveConfig({projects = projects})
    end
    options.projects = projects
end
return ____exports
