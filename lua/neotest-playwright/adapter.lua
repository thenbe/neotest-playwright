--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end
-- End of Lua Library inline imports
local ____exports = {}
local ____build_2Dspec = require('neotest-playwright.build-spec')
local buildSpec = ____build_2Dspec.buildSpec
local ____discover = require('neotest-playwright.discover')
local discoverPositions = ____discover.discoverPositions
local filterDir = ____discover.filterDir
local isTestFile = ____discover.isTestFile
local root = ____discover.root
local ____results = require('neotest-playwright.results')
local results = ____results.results
local DEFAULT_ADAPTER = {
    name = "neotest-playwright",
    is_test_file = isTestFile,
    root = root,
    filter_dir = filterDir,
    discover_positions = discoverPositions,
    build_spec = buildSpec,
    results = results
}
--- Factory function for creating an adapter.
____exports.createAdapter = function(config)
    local adapter = __TS__ObjectAssign({}, DEFAULT_ADAPTER, config)
    return adapter
end
return ____exports
