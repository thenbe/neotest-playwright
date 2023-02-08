--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
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
____exports.adapter = {
    name = "neotest-playwright",
    is_test_file = isTestFile,
    root = root,
    filter_dir = filterDir,
    discover_positions = discoverPositions,
    build_spec = buildSpec,
    results = results
}
setmetatable(
    ____exports.adapter,
    {__call = function(self, config)
        if config.debug then
            print("neotest-playwright config:")
            print(vim.inspect(config, {}))
        end
        return ____exports.adapter
    end}
)
return ____exports
