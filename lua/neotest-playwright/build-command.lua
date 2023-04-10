--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__ArrayPushArray(self, items)
    local len = #self
    for i = 1, #items do
        len = len + 1
        self[len] = items[i]
    end
    return len
end
-- End of Lua Library inline imports
local ____exports = {}
local buildReporters
local ____logging = require('neotest-playwright.logging')
local logger = ____logging.logger
--- A function that takes in CommandOptions and returns a string.
____exports.buildCommand = function(options, extraArgs)
    local o = options
    local reporters = o.reporters or ({"list", "json"})
    local reportersArg = buildReporters(reporters)
    local command = {}
    command[#command + 1] = o.bin
    command[#command + 1] = "test"
    if reportersArg ~= nil then
        command[#command + 1] = reportersArg
    end
    if o.debug == true then
        command[#command + 1] = "--debug"
    end
    if o.headed == true then
        command[#command + 1] = "--headed"
    end
    if o.retries ~= nil then
        command[#command + 1] = "--retries=" .. tostring(o.retries)
    end
    if o.abortOnFailure == true then
        command[#command + 1] = "-x"
    end
    if o.workers ~= nil then
        command[#command + 1] = "--workers=" .. tostring(o.workers)
    end
    if o.timeout ~= nil then
        command[#command + 1] = "--timeout=" .. tostring(o.timeout)
    end
    if o.config ~= nil then
        command[#command + 1] = "--config=" .. tostring(o.config)
    end
    if o.projects ~= nil then
        for ____, project in ipairs(o.projects) do
            if type(project) == "string" and #project > 0 then
                command[#command + 1] = "--project=" .. project
            end
        end
    end
    __TS__ArrayPushArray(command, extraArgs)
    if o.testFilter ~= nil then
        command[#command + 1] = o.testFilter
    end
    logger("debug", "command", command)
    return command
end
--- Returns `--reporter=${reporters[0]},${reporters[1]},...`
buildReporters = function(reporters)
    if #reporters == 0 then
        return nil
    else
        return "--reporter=" .. table.concat(reporters, ",")
    end
end
return ____exports
