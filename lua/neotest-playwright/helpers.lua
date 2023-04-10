--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____logging = require('neotest-playwright.logging')
local logger = ____logging.logger
____exports.emitError = function(msg)
    logger("error", msg)
    vim.defer_fn(
        function() return vim.cmd(("echohl WarningMsg | echo \"" .. msg) .. "\" | echohl None") end,
        0
    )
end
return ____exports
