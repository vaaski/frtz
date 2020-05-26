const { Command, flags: flg } = require("@oclif/command")
const fs = require("fs")
const path = require("path")
const { cli } = require("cli-ux")

class SetupCommand extends Command {
  async run() {
    const { flags } = this.parse(SetupCommand)
    const config = {}

    if (flags.host) config.host = flags.host
    else
      config.host = await cli.prompt("Host", {
        default: "http://fritz.box",
      })

    if (flags.username) config.username = flags.username
    else
      config.username = await cli.prompt("username (optional)", {
        required: false,
      })

    if (flags.password) config.password = flags.password
    else {
      const savePassword =
        (await cli.prompt("do you want to save your password? (Y/n)", {
          type: "single",
          required: false,
        })) || "Y"

      if (savePassword.toLowerCase() === "n") this.log("")
      else config.password = await cli.prompt("password", { type: "hide" })
    }

    fs.writeFileSync(
      path.join(this.config.configDir, "config.json"),
      JSON.stringify(config)
    )
  }
}

SetupCommand.description = `save configuration for fast access
save:
-hostname
-username
-password (optional)`

SetupCommand.flags = {
  host: flg.string({ char: "h", description: "set hostname" }),
  username: flg.string({ char: "u", description: "set username" }),
  password: flg.string({ char: "p", description: "set password" }),
}

module.exports = SetupCommand
