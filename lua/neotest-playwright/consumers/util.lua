local async = require("neotest.async")

local M = {}

--- @param client neotest.Client
M.get_pos = function(client)
	local file = async.fn.expand("%:p")
	local row = async.fn.getpos(".")[2] - 1

	local position = client:get_nearest(file, row, {})
	if not position then
		print("no position found")
		return
	end

	return position
end

return M
