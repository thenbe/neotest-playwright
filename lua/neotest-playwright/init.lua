--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__StringEndsWith(self, searchString, endPosition)
    if endPosition == nil or endPosition > #self then
        endPosition = #self
    end
    return string.sub(self, endPosition - #searchString + 1, endPosition) == searchString
end

local function __TS__ArraySome(self, callbackfn, thisArg)
    for i = 1, #self do
        if callbackfn(thisArg, self[i], i - 1, self) then
            return true
        end
    end
    return false
end
-- End of Lua Library inline imports
local ____exports = {}
local ____build_2Dspec = require('neotest-playwright.build-spec')
local buildSpec = ____build_2Dspec.buildSpec
local ____report = require('neotest-playwright.report')
local parseOutput = ____report.parseOutput
local lib = require("neotest.lib")
local function isTestFile(file_path)
    if not file_path then
        return false
    end
    local endings = {".spec.ts", ".test.ts", ".spec.js", ".test.js"}
    local result = __TS__ArraySome(
        endings,
        function(____, ending) return __TS__StringEndsWith(file_path, ending) end
    )
    return result
end
local function discoverPositions(path)
    local query = "\n\t\t; -- Namespaces --\n\n\t\t; Matches: test.describe('title')\n\n\t\t(call_expression\n\t\t function: (member_expression) @func_name (#eq? @func_name \"test.describe\")\n\n\t\t arguments: (arguments\n\t\t\t (string (string_fragment) @namespace.name)\n\t\t\t ) @namespace.definition\n\t\t )\n\n\t\t; -- Tests --\n\n\t\t; Matches: test('title')\n\n\t\t(call_expression\n\t\t function: (identifier) @func_name (#eq? @func_name \"test\")\n\n\t\t arguments: (arguments\n\t\t\t(string (string_fragment) @test.name\n\t\t\t)\n\t\t\t) @test.definition\n\t\t)\n\n\t\t; Matches: test.only('title') / test.fixme('title')\n\n\t\t(call_expression\n\t\t function: (member_expression) @func_name (#any-of? @func_name \"test.only\" \"test.fixme\" \"test.skip\")\n\n\t\t arguments: (arguments\n\t\t\t(string (string_fragment) @test.name)\n\t\t\t) @test.definition\n\t\t)\n\t\t"
    return lib.treesitter.parse_positions(path, query, {nested_tests = true})
end
____exports.adapter = {
    name = "neotest-playwright",
    is_test_file = isTestFile,
    root = lib.files.match_root_pattern("package.json"),
    discover_positions = discoverPositions,
    filter_dir = function(name, _rel_path, _root)
        return name ~= "node_modules"
    end,
    build_spec = function(args)
        return buildSpec(args)
    end,
    results = function(spec, _result, _tree)
        local ____opt_0 = spec.context
        if ____opt_0 ~= nil then
            ____opt_0:stop_stream()
        end
        local ____opt_2 = spec.context
        local resultsPath = ____opt_2 and ____opt_2.results_path
        local success, data = pcall(lib.files.read, resultsPath)
        if not success then
            print("No test output file found", resultsPath)
            return {}
        end
        local ok, parsed = pcall(vim.json.decode, data, {luanil = {object = true}})
        if not ok then
            print("Failed to parse test output json", resultsPath)
            return {}
        end
        local results = parseOutput(parsed, resultsPath)
        return results
    end
}
return ____exports
