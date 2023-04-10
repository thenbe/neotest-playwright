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
local ____adapter_2Doptions = require('neotest-playwright.adapter-options')
local options = ____adapter_2Doptions.options
local ____logging = require('neotest-playwright.logging')
local logger = ____logging.logger
local ____persist = require('neotest-playwright.persist')
local loadProjectCache = ____persist.loadProjectCache
local saveProjectCache = ____persist.saveProjectCache
local ____playwright = require('neotest-playwright.playwright')
local get_config = ____playwright.get_config
local ____select_2Dmultiple = require('neotest-playwright.select-multiple')
local selectMultiple = ____select_2Dmultiple.selectMultiple
--- Returns a list of project names
local function parseProjects(output)
    local names = __TS__ArrayMap(
        output.config.projects,
        function(____, p) return p.name end
    )
    return names
end
--- Returns a list of project names from the cached data.
____exports.loadPreselectedProjects = function()
    local cache = loadProjectCache()
    if cache then
        return cache.projects
    else
        return nil
    end
end
____exports.create_project_command = function()
    vim.api.nvim_create_user_command(
        "NeotestPlaywrightProject",
        function()
            local output = get_config()
            local choices = parseProjects(output)
            local preselected = nil
            if options.persist_project_selection then
                preselected = ____exports.loadPreselectedProjects()
            end
            local selection = selectProjects(choices, preselected)
            setProjects(selection)
            vim.api.nvim_command("NeotestPlaywrightRefresh")
        end,
        {nargs = 0}
    )
end
selectProjects = function(choices, preselected)
    local prompt = "Select projects to include in the next test run:"
    local choice = selectMultiple({prompt = prompt, choices = choices, initial = "all", preselected = preselected})
    logger("debug", "selectProjects", choice)
    return choice
end
setProjects = function(projects)
    logger("debug", "setProjects", projects)
    if options.persist_project_selection then
        saveProjectCache({projects = projects})
    end
    options.projects = projects
end
return ____exports
