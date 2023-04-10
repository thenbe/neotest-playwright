--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____finders = require('neotest-playwright.finders')
local getPlaywrightBinary = ____finders.getPlaywrightBinary
local getPlaywrightConfig = ____finders.getPlaywrightConfig
local get_cwd = ____finders.get_cwd
____exports.options = {
    projects = {},
    preset = "none",
    persist_project_selection = false,
    get_playwright_binary = getPlaywrightBinary,
    get_playwright_config = getPlaywrightConfig,
    get_cwd = get_cwd,
    env = {},
    extra_args = {},
    tempDataFile = vim.fn.stdpath("data") .. "/neotest-playwright-test-list.json",
    enable_dynamic_test_discovery = false
}
return ____exports
