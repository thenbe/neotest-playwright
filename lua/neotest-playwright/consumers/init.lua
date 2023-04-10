local M = {}

--- @param client neotest.Client
M.consumers = function(client)
	return {
		attachment = function()
			require("neotest-playwright.consumers.attachment").attachment(client)
		end,
	}
end

return M
