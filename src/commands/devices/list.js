const { Command, flags: flg } = require("@oclif/command")
const fs = require("fs")
const path = require("path")
const { network } = require("frtz-core")
const { cli } = require("cli-ux")
const { conf, cache, readFile, login, extendLogin } = require("../../shared")

class ListCommand extends Command {
  async run() {
    const { flags } = this.parse(ListCommand)
    const config = await readFile(conf(this))

    let profile
    if (flags.profile)
      if (config.profiles[flags.profile])
        profile = config.profiles[flags.profile]
      else this.error("This profile does not exist")
    else profile = config

    profile = { ...profile, ...flags }

    if (!profile.password)
      this.error(
        "a password must be provided either as a flag or via setup config (run frtz setup)"
      )

    try {
      const loginStarted = Number(new Date())
      cli.action.start("logging in")
      const { cached, SID } = await login(profile, this, flags.profile)
      const loginTime = Number(new Date()) - loginStarted
      cli.action.stop(
        `logged in ${cached ? "from cache " : ""}(${Number(
          (loginTime / 1000).toFixed(2)
        )}s)`
      )

      const listStarted = Number(new Date())
      cli.action.start("getting device list, please be paitent")
      const data = await network.getDevices({ SID, host: profile.host })
      await extendLogin(this)
      const listTime = Number(new Date()) - listStarted
      cli.action.stop(`got list (${Number((listTime / 1000).toFixed(2))}s)`)

      const defaultTable = {
        name: { header: "online devices" },
        ipv4: { minWidth: 16 },
        ipv6: { extended: true },
        mac: { minWidth: 19 },
      }

      this.log("")
      cli.table(
        data.active,
        {
          ...defaultTable,
          type: { extended: true },
          port: {
            header: "speed",
            get: row => (row.port === "WLAN" ? row.sum_props : row.port),
          },
        },
        flags
      )
      this.log("")
      cli.table(
        data.passive,
        {
          ...defaultTable,
          name: { header: "offline devices" },
        },
        flags
      )

      if (flags.save) {
        this.log("")
        const saveLocation = path.join(
          this.config.dataDir,
          "network-devices.json"
        )

        cli.action.start("saving list")

        fs.writeFileSync(saveLocation, JSON.stringify(data))
        cli.action.stop("saved")
        this.log(`saved to ${saveLocation}`)
      }

      const cacheData = { devices: [...data.active, ...data.passive] }
      fs.writeFileSync(cache(this), JSON.stringify(cacheData))
    } catch (error) {
      cli.action.stop("error")
      this.error(error)
    }
  }
}

ListCommand.description = `List both online and offline devices.`

ListCommand.aliases = ["list", "l"]

ListCommand.examples = ["$ frtz list -s -x -P work"]

ListCommand.args = []

ListCommand.flags = {
  host: flg.string({ char: "h", description: "set hostname" }),
  user: flg.string({ char: "u", description: "set username" }),
  password: flg.string({ char: "p", description: "set password" }),
  save: flg.boolean({ char: "s", description: "save output to dataDir" }),
  profile: flg.string({ char: "P", description: "use a profile" }),
  ...cli.table.flags({ only: ["extended", "output"] }),
}

module.exports = ListCommand
