local async = require('neotest.async')

local M = {}

--- @param client neotest.Client
M.attachment = function(client)
	local position = require('neotest-playwright.consumers.util').get_pos(client)
	if not position then
		return
	end

	local children_ids = {}

	for _, child in position:iter_nodes() do
		-- print("child", vim.inspect(child:data().name))
		table.insert(children_ids, child:data().id)
	end

	local pos_id = position:data().id
	-- if not results[pos_id] then
	-- 	return
	-- end

	local file = async.fn.expand('%:p')

	-- local adapter_name, adapter = client:get_adapter(file)
	local adapter_name, adapter = client:get_adapter(file)
	if not adapter_name or not adapter then
		return
	end

	local results = client:get_results(adapter_name)
	-- client.listeners.discover_positions

	local attachments = {}

	-- iterate over children_ids, then see if any of them are in results (key is pos_id)
	-- if so, add anything result.attachments to attachments
	for _, child in position:iter_nodes() do
		local result = results[child:data().id] or {}
		local result_attachments = result.attachments or {}
		for _, attachment in ipairs(result_attachments) do
			-- add project_id to attachment, then add to attachments
			local project_id = child:data().project_id
			attachment.project_id = project_id

			table.insert(attachments, attachment)
		end
	end

	local options = {}
	local function option_choice(attachment)
    return string.format('%s %s', attachment.project_id, attachment.name)
	end
	for _, attachment in ipairs(attachments) do
		local option = option_choice(attachment)
		table.insert(options, option)
	end

	if #options == 0 then
		print('No attachments found')
		return
	end

  vim.ui.select(options, { prompt = 'Select an attachment:' }, function(choice)
    if not choice then
        return
    end

		local selection
		for _, attachment in ipairs(attachments) do
			if choice == option_choice(attachment) then
				selection = attachment
				break
			end
		end
		if not selection then
			return
		end

    local xdg_content_types = { 'video/webm', 'image/png' }

    if selection.contentType == 'application/zip' then
        local bin = adapter.options.get_playwright_binary(file)
        local cmd = bin .. ' show-trace ' .. selection.path .. ' &'
        os.execute(cmd)
    elseif vim.tbl_contains(xdg_content_types, selection.contentType) then
        local cmd = 'xdg-open ' .. selection.path .. ' &'
        os.execute(cmd)
    end
  end)
end

return M
