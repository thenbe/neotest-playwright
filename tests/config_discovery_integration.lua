-- Run headlessly with the adapter and Neotest dependencies on runtimepath.
local nio = require('nio')
local options = require('neotest-playwright.adapter-options').options
local discovery = require('neotest-playwright.discover')
local root = vim.fn.tempname()
vim.fn.mkdir(root .. '/excluded', 'p')
local function write(name, contents)
	vim.fn.writefile(vim.split(contents, '\n'), root .. '/' .. name)
end
local test_module = assert(vim.env.PLAYWRIGHT_TEST_MODULE)
local binary = assert(vim.env.PLAYWRIGHT_BINARY)
write('package.json', '{"type":"module"}')
write('playwright.config.mjs', 'export default { testMatch: ["**/*.test.ts", "**/*.browser.ts"], testIgnore: "**/excluded/**" }')
local source = 'import { test, expect } from ' .. vim.json.encode(test_module) .. '; test("configured test", () => { expect(1).toBe(1) });'
write('journey.test.ts', source)
write('custom.browser.ts', source)
write('component.test.tsx', "throw new Error('Belongs to another runner')")
write('excluded/ignored.test.ts', "throw new Error('Excluded')")
options.enable_dynamic_test_discovery = true
options.get_playwright_binary = function() return binary end
options.get_playwright_config = function() return root .. '/playwright.config.mjs' end
options.get_cwd = function() return root end
local done, failure = false, nil
nio.run(function()
	local ok, err = pcall(function()
		discovery.populate_data(root)
		assert(discovery.isTestFile(root .. '/journey.test.ts'))
		assert(discovery.isTestFile(root .. '/custom.browser.ts'))
		assert(not discovery.isTestFile(root .. '/component.test.tsx'))
		assert(not discovery.isTestFile(root .. '/excluded/ignored.test.ts'))
		-- Running from a summary buffer or after changing cwd must retain the
		-- execution context of the chosen test, without consulting that buffer.
		local seen_path
		options.get_playwright_config = function(path)
			seen_path = path
			return root .. '/playwright.config.mjs'
		end
		local position = { path = root .. '/journey.test.ts', type = 'file' }
		local spec = require('neotest-playwright.build-spec').buildSpec({
			tree = { data = function() return position end },
		})
		assert(seen_path == position.path, 'Execution must resolve from the selected test')
		local future = nio.control.future()
		vim.system(spec.command, { cwd = spec.cwd, env = spec.env, text = true }, function(result)
			future.set(result)
		end)
		local result = future.wait()
		nio.scheduler()
		assert(result.code == 0, 'The configured test must execute successfully')
		vim.fn.delete(spec.context.results_path)
		local data = require('neotest-playwright.adapter-data').data
		assert(#data.specs == 2, 'Only configured and non-excluded tests must be listed')
		-- A config may live outside the conventional project root when provided
		-- explicitly; exercise the report cache independently of root detection.
		write('playwright.config.mjs', 'export default { testMatch: "**/*.browser.ts" }')
		discovery.refresh_data()
		assert(#data.specs == 1)
		assert(data.specs[1].file == 'custom.browser.ts')
	end)
	failure = not ok and err or nil
	done = true
end)
assert(vim.wait(120000, function() return done end), 'Integration timed out')
vim.fn.delete(root, 'rf')
assert(not failure, failure)
print('Real Playwright config discovery integration passed')
