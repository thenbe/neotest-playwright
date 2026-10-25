local async = require('nio').tests
-- Load the checkout rather than an adapter already loaded by the editor.
for name in pairs(package.loaded) do
	if name:match('^neotest%-playwright') then package.loaded[name] = nil end
end
local discovery
local options = require('neotest-playwright.adapter-options').options
local playwright = require('neotest-playwright.playwright')
local root = vim.fn.getcwd() .. '/tests/sample'

describe('configured file discovery', function()
	local original_config
	local calls
	before_each(function()
		original_config = playwright.get_config
		calls = 0
		options.enable_dynamic_test_discovery = true
		options.get_playwright_binary = function() return 'playwright' end
		options.get_playwright_config = function() return root .. '/playwright.config.ts' end
		options.get_cwd = function() return root end
		playwright.get_config = function()
			calls = calls + 1
			return {
				config = { rootDir = root },
				errors = {},
				suites = { {
					specs = { { file = 'custom.browser.ts', title = 'custom filename', tests = {} } },
					suites = {},
				} },
			}
		end
		package.loaded['neotest-playwright.discover'] = nil
		discovery = require('neotest-playwright.discover')
		discovery.refresh_data()
	end)
	after_each(function()
		playwright.get_config = original_config
		options.enable_dynamic_test_discovery = false
	end)

	async.it('uses the report for custom names and rejects unmatched suffixes', function()
		assert.is_true(discovery.isTestFile(root .. '/custom.browser.ts'))
		assert.is_false(discovery.isTestFile(root .. '/component.test.tsx'))
	end)

	async.it('shares reports with position discovery and refreshes explicitly', function()
		discovery.populate_data(root .. '/custom.browser.ts')
		local after_first = calls
		discovery.populate_data(root .. '/custom.browser.ts')
		assert.equals(after_first, calls)
		discovery.refresh_data()
		discovery.populate_data(root .. '/custom.browser.ts')
		assert.is_true(calls > after_first)
	end)
end)
