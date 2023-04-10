--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local neotest_logger = require("neotest.logging")
--- Wrapper around `neotest.logging` that adds a prefix to the log message.
____exports.logger = function(level, message, ...)
    local prefix = "[neotest-playwright]"
    neotest_logger[level]((prefix .. " ") .. message, ...)
end
return ____exports
