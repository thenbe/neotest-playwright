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
local ____neotest_2Dplaywright_2Epickers = require("neotest-playwright.pickers")
local show_picker = ____neotest_2Dplaywright_2Epickers.show_picker
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
            local preselected = {}
            if options.persist_project_selection then
                preselected = ____exports.loadPreselectedProjects() or ({})
            end
            selectProjects(
                choices,
                preselected,
                function(selection)
                    setProjects(selection)
                    logger("info", "selectProjects", selection)
                    vim.api.nvim_command("NeotestPlaywrightRefresh")
                end
            )
        end,
        {nargs = 0}
    )
end
selectProjects = function(choices, preselected, on_select, use_telescope, telescope_opts)
    if use_telescope == nil then
        use_telescope = options.experimental.telescope.enabled
    end
    if telescope_opts == nil then
        telescope_opts = options.experimental.telescope.opts
    end
    local prompt = "Select projects to include in the next test run:"
    if use_telescope then
        show_picker(
            telescope_opts,
            {
                prompt = prompt,
                choices = choices,
                preselected = preselected,
                on_select = function(selection) return on_select(selection) end
            }
        )
    else
        local choice = selectMultiple({prompt = prompt, choices = choices, initial = "all", preselected = preselected})
        on_select(choice)
    end
end
setProjects = function(projects)
    logger("debug", "setProjects", projects)
    if options.persist_project_selection then
        saveProjectCache({projects = projects})
    end
    options.projects = projects
end
return ____exports
