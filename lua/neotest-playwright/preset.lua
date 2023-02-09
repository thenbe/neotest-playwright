--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.set_preset = function(preset)
    print("set_preset", preset)
end
____exports.select_preset = function()
    local options = {"headless", "headed", "debug"}
    local prompt = "Select preset for neotest-playwright:"
    local choice = nil
    vim.ui.select(
        options,
        {prompt = prompt},
        function(c)
            choice = c
        end
    )
    return choice
end
____exports.create_preset_command = function()
    vim.api.nvim_create_user_command(
        "NeotestPlaywright",
        function()
            local choice = ____exports.select_preset()
            if choice == nil then
                return
            end
            ____exports.set_preset(choice)
        end,
        {nargs = 0}
    )
end
return ____exports
