const { Command } = require("@oclif/command")
const isWindows = require("is-windows")()
const { exec } = require("child_process")

class ShowCommand extends Command {
  async run() {
    const { args } = this.parse(ShowCommand)
    const open = path => {
      if (isWindows) return exec(`explorer ${path}`)
      this.log(path)
    }

    if (args.type === "config") return open(this.config.configDir)
    if (args.type === "cache") return open(this.config.cacheDir)
  }
}

ShowCommand.description = `Show the locations of config and cache files`

ShowCommand.args = [
  {
    name: "type",
    default: "config",
    description: "choose what to open",
    options: ["config", "cache"],
  },
]

module.exports = ShowCommand
