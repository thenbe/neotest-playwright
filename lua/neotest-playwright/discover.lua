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
local lib = require("neotest.lib")
____exports.root = lib.files.match_root_pattern("package.json")
____exports.filterDir = function(name, _rel_path, _root)
    return name ~= "node_modules"
end
____exports.isTestFile = function(file_path)
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
____exports.discoverPositions = function(path)
    local query = "\n\t\t; -- Namespaces --\n\n\t\t; Matches: test.describe('title')\n\n\t\t(call_expression\n\t\t function: (member_expression) @func_name (#eq? @func_name \"test.describe\")\n\n\t\t arguments: (arguments\n\t\t\t (string (string_fragment) @namespace.name)\n\t\t\t ) @namespace.definition\n\t\t )\n\n\t\t; -- Tests --\n\n\t\t; Matches: test('title')\n\n\t\t(call_expression\n\t\t function: (identifier) @func_name (#eq? @func_name \"test\")\n\n\t\t arguments: (arguments\n\t\t\t(string (string_fragment) @test.name\n\t\t\t)\n\t\t\t) @test.definition\n\t\t)\n\n\t\t; Matches: test.only('title') / test.fixme('title')\n\n\t\t(call_expression\n\t\t function: (member_expression) @func_name (#any-of? @func_name \"test.only\" \"test.fixme\" \"test.skip\")\n\n\t\t arguments: (arguments\n\t\t\t(string (string_fragment) @test.name)\n\t\t\t) @test.definition\n\t\t)\n\t\t"
    return lib.treesitter.parse_positions(path, query, {nested_tests = true})
end
return ____exports
