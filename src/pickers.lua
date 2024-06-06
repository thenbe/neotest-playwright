local has_telescope, telescope = pcall(require, 'telescope')

if not has_telescope then
	error('nvim-telescope/telescope.nvim is not installed')
end

local finders = require('telescope.finders')
local pickers = require('telescope.pickers')
local conf = require('telescope.config').values
local action_state = require('telescope.actions.state')
local action_utils = require('telescope.actions.utils')
local actions = require('telescope.actions')

---@alias ProjectName string

---@class NeotestPlaywrightProjectOptions
---@field prompt string
---@field choices ProjectName[]
---@field preselected ProjectName[]
---@field on_select fun(selected: ProjectName[])

local select_some = function(prompt_bufnr, selections)
	local current_picker = action_state.get_current_picker(prompt_bufnr)
	local selections_set = {}
	for _, selection in ipairs(selections) do
		selections_set[selection] = true
	end
	action_utils.map_entries(prompt_bufnr, function(entry, _, row)
		if selections_set[entry.value] and not current_picker._multi:is_selected(entry) then
			current_picker._multi:add(entry)
			if current_picker:can_select_row(row) then
				local caret = current_picker:update_prefix(entry, row)
				if current_picker._selection_entry == entry and current_picker._selection_row == row then
					current_picker.highlighter:hi_selection(row, caret:match('(.*%S)'))
				end
				current_picker.highlighter:hi_multiselect(row, current_picker._multi:is_selected(entry))
			end
		end
	end)
	current_picker:get_status_updater(current_picker.prompt_win, current_picker.prompt_bufnr)()
end

---@param np_opts NeotestPlaywrightProjectOptions
local function show_picker(opts, np_opts)
	opts = opts or {}

	-- convert `{'PROJECT1', 'PROJECT2'}` to `{{text='PROJECT1'}, {text='PROJECT2'}}`
	local results = vim
		.iter(np_opts.choices)
		:map(function(x)
			return { text = x }
		end)
		:totable()

	local picker = pickers.new(opts, {
		prompt_title = np_opts.prompt,
		finder = finders.new_table({
			results = results,
			entry_maker = function(entry)
				return {
					value = entry.text,
					display = entry.text,
					ordinal = entry.text,
				}
			end,
		}),
		sorter = conf.generic_sorter(opts),
		attach_mappings = function(prompt_bufnr, map)
			local picker = action_state.get_current_picker(prompt_bufnr)

			-- Confirm selection on `<CR>`
			actions.select_default:replace(function()
				---@type ProjectName[]
				local selected = {}
				for _, entry in ipairs(picker:get_multi_selection()) do
					---@type ProjectName
					local value = entry.value
					table.insert(selected, value)
				end
				np_opts.on_select(selected)
				actions.close(prompt_bufnr)
			end)

			-- Toggle the selection under the cursor
			map('n', '<Tab>', function()
				actions.toggle_selection(prompt_bufnr)
			end)

			-- Load preselected projects into the picker
			map('n', 'R', function()
				select_some(prompt_bufnr, np_opts.preselected)
			end)

			return true
		end,
	})
	picker:find()

	-- Automatically mark the selected options as selected. This function errors
	-- when called quickly after creating the picker. Therefore, we delay its
	-- execution a bit.
	local timer = vim.loop.new_timer()
	timer:start(
		70,
		0,
		vim.schedule_wrap(function()
			timer:stop()
			timer:close()
			-- `picker.manager` will be false when the picker is first created. We
			-- need to wait for it to be initialized before attempting to
			-- `select_some()`.
			if picker.manager ~= false then
				select_some(picker.prompt_bufnr, np_opts.preselected)
			end
		end)
	)
end

local M = {}
M.show_picker = show_picker
return M
