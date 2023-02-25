local async = require("plenary.async.tests")
local plugin = require("neotest-playwright").adapter
local Tree = require("neotest.types").Tree

require("neotest-playwright-assertions")

A = function(...)
	print(vim.inspect(...))
end

local test_file = "./tests/sample/example.spec.ts"
local config_file = "./tests/sample/playwright.config.ts"

describe("is_test_file", function()
	it("matches test files", function()
		assert.True(plugin.is_test_file(test_file))
	end)

	it("does not match plain js files", function()
		assert.False(plugin.is_test_file("./index.js"))
	end)
end)

describe("discover_positions", function()
	async.it("provides meaningful names from a basic spec", function()
		local positions = plugin.discover_positions(test_file):to_list()

		local expected_output = {
			{
				name = "example.spec.ts",
				type = "file",
			},
			{
				{
					name = "math",
					type = "namespace",
				},
				{
					{
						name = "addition",
						type = "test",
					},
					{
						name = "not substraction",
						type = "test",
					},
				},
				{
					name = "common sense",
					type = "test",
				},
				{
					name = "not so common sense",
					type = "test",
				},
			},
		}

		assert.equals(expected_output[1].name, positions[1].name)
		assert.equals(expected_output[1].type, positions[1].type)
		assert.equals(expected_output[2][1].name, positions[2][1].name)
		assert.equals(expected_output[2][1].type, positions[2][1].type)

		-- assert.equals(5, #positions[2])
		for i, value in ipairs(expected_output[2][2]) do
			assert.is.truthy(value)
			local position = positions[2][i + 1][1]
			assert.is.truthy(position)
			assert.equals(value.name, position.name)
			assert.equals(value.type, position.type)
		end
	end)

	-- async.it("provides meaningful names for array driven tests", function()
	-- 	local positions = plugin.discover_positions("./spec/array.test.ts"):to_list()
	--
	-- 	local expected_output = {
	-- 		{
	-- 			name = "array.test.ts",
	-- 			type = "file",
	-- 		},
	-- 		{
	-- 			{
	-- 				name = "describe text",
	-- 				type = "namespace",
	-- 			},
	-- 			{
	-- 				{
	-- 					name = "Array1",
	-- 					type = "test",
	-- 				},
	-- 				{
	-- 					name = "Array2",
	-- 					type = "test",
	-- 				},
	-- 				{
	-- 					name = "Array3",
	-- 					type = "test",
	-- 				},
	-- 				{
	-- 					name = "Array4",
	-- 					type = "test",
	-- 				},
	-- 			},
	-- 		},
	-- 	}
	--
	-- 	assert.equals(expected_output[1].name, positions[1].name)
	-- 	assert.equals(expected_output[1].type, positions[1].type)
	-- 	assert.equals(expected_output[2][1].name, positions[2][1].name)
	-- 	assert.equals(expected_output[2][1].type, positions[2][1].type)
	-- 	assert.equals(5, #positions[2])
	-- 	for i, value in ipairs(expected_output[2][2]) do
	-- 		assert.is.truthy(value)
	-- 		local position = positions[2][i + 1][1]
	-- 		assert.is.truthy(position)
	-- 		assert.equals(value.name, position.name)
	-- 		assert.equals(value.type, position.type)
	-- 	end
	-- end)
end)

describe("build_spec", function()
	async.it("builds command for file test", function()
		local positions = plugin.discover_positions(test_file):to_list()
		local tree = Tree.from_list(positions, function(pos)
			return pos.id
		end)
		local spec = plugin.build_spec({ tree = tree })

		assert.is.truthy(spec)
		local command = spec.command
		assert.is.truthy(command)
		assert.contains(command, "./node_modules/.bin/playwright")
		assert.contains(command, "test")
		assert.contains(command, "--reporter=list,json")
		assert.contains(command, "--config=" .. config_file)
		-- assert.is_not.contains(command, "--config=jest.config.js")
		assert.contains(command, test_file)
		assert.is.truthy(spec.context.file)
		assert.is.truthy(spec.context.results_path)
		assert.is.truthy(spec.env.PLAYWRIGHT_JSON_OUTPUT_NAME)
	end)

	async.it("builds command for namespace", function()
		local positions = plugin.discover_positions(test_file):to_list()

		local tree = Tree.from_list(positions, function(pos)
			return pos.id
		end)

		local spec = plugin.build_spec({ tree = tree:children()[1] })

		assert.is.truthy(spec)
		local command = spec.command
		assert.is.truthy(command)
		assert.contains(command, "./node_modules/.bin/playwright")
		assert.contains(command, "test")
		assert.contains(command, "--reporter=list,json")
		assert.contains(command, "--config=" .. config_file)
		assert.contains(command, test_file .. ":3")
		assert.is.truthy(spec.context.file)
		assert.is.truthy(spec.context.results_path)
		assert.is.truthy(spec.env.PLAYWRIGHT_JSON_OUTPUT_NAME)
	end)

	async.it("builds command for nested namespace", function()
		local positions = plugin.discover_positions(test_file):to_list()

		local tree = Tree.from_list(positions, function(pos)
			return pos.id
		end)

		local spec = plugin.build_spec({ tree = tree:children()[1]:children()[1] })
		print(vim.inspect(spec.command))

		assert.is.truthy(spec)
		local command = spec.command
		assert.is.truthy(command)
		assert.contains(command, "./node_modules/.bin/playwright")
		assert.contains(command, "test")
		assert.contains(command, "--reporter=list,json")
		assert.contains(command, "--config=" .. config_file)
		assert.contains(command, test_file .. ":4")
		assert.is.truthy(spec.context.file)
		assert.is.truthy(spec.context.results_path)
		assert.is.truthy(spec.env.PLAYWRIGHT_JSON_OUTPUT_NAME)
	end)

	-- async.it("builds correct command for test name with ' ", function()
	-- 	local positions = plugin.discover_positions("./spec/nestedDescribe.test.ts"):to_list()
	--
	-- 	local tree = Tree.from_list(positions, function(pos)
	-- 		return pos.id
	-- 	end)
	--
	-- 	local spec = plugin.build_spec({ tree = tree:children()[1]:children()[1]:children()[2] })
	-- 	assert.is.truthy(spec)
	-- 	local command = spec.command
	-- 	assert.is.truthy(command)
	-- 	assert.contains(command, "jest")
	-- 	assert.contains(command, "--json")
	-- 	assert.is_not.contains(command, "--config=jest.config.js")
	-- 	assert.contains(command, "--testNamePattern='^outer inner this has a \\'$'")
	-- 	assert.contains(command, "./spec/nestedDescribe.test.ts")
	-- 	assert.is.truthy(spec.context.file)
	-- 	assert.is.truthy(spec.context.results_path)
	-- end)
end)
