const { Command, flags: flg } = require("@oclif/command")
const fs = require("fs")
const { cli } = require("cli-ux")
const { conf } = require("../shared")

class SetupCommand extends Command {
  async run() {
    const { flags } = this.parse(SetupCommand)
    const config = {}
    let profile = false

    if (flags.host) config.host = flags.host
    else
      config.host = await cli.prompt("Host", {
        default: "http://fritz.box",
      })

    if (flags.username) config.username = flags.username
    else
      config.username = await cli.prompt("Username (optional)", {
        required: false,
      })

    if (flags.password) config.password = flags.password
    else {
      const savePassword =
        (await cli.prompt("Do you want to save your password? (Y/n)", {
          type: "single",
          required: false,
        })) || "Y"

      this.log("")
      if (savePassword.toLowerCase() !== "n")
        config.password = await cli.prompt("Password", { type: "hide" })
    }

    if (flags.profile) profile = flags.profile
    else {
      const defaultProfile =
        (await cli.prompt(
          "Do you want to save this to the default Profile (Y/n)",
          {
            type: "single",
            required: false,
          }
        )) || "Y"

      this.log("")
      if (defaultProfile.toLowerCase() === "n")
        profile = await cli.prompt("Profile")
    }

    fs.writeFileSync(conf(this, profile), JSON.stringify(config))
  }
}

SetupCommand.description = `Save configuration for fast access
This saves:
-Hostname
-Username
-Password (optional)

You can also save it to a specific profile using -P.`

SetupCommand.flags = {
  host: flg.string({ char: "h", description: "set hostname" }),
  username: flg.string({ char: "u", description: "set username" }),
  password: flg.string({ char: "p", description: "set password" }),
  profile: flg.string({ char: "P", description: "save to a profile" }),
}

module.exports = SetupCommand
