const { Command, flags: flg } = require("@oclif/command")
const fs = require("fs")
const path = require("path")
const { auth, network } = require("frtz-core")
const { cli } = require("cli-ux")

const readPromise = (...arg) =>
  new Promise(res => {
    fs.readFile(...arg, (err, data) => {
      if (err) res({})
      else res(JSON.parse(data))
    })
  })

class ListCommand extends Command {
  async run() {
    const { flags } = this.parse(ListCommand)
    const config = await readPromise(
      path.join(this.config.configDir, "config.json")
    )
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

    let login
    try {
      const loginStarted = Number(new Date())
      cli.action.start("logging in")
      login = await auth.login(profile)
      const loginTime = Number(new Date()) - loginStarted
      cli.action.stop(`logged in (${Number((loginTime / 1000).toFixed(2))}s)`)

      const listStarted = Number(new Date())
      cli.action.start("getting device list, please be paitent")
      const data = await network.getDevices({
        SID: login.SID,
        host: profile.host,
      })
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
    } catch (error) {
      cli.action.stop("error")
      console.log(error)
    }
  }
}

ListCommand.description = `list network devices.`

ListCommand.args = []

ListCommand.flags = {
  host: flg.string({ char: "h", description: "Set hostname" }),
  user: flg.string({ char: "u", description: "Set username" }),
  password: flg.string({ char: "p", description: "Set password" }),
  save: flg.boolean({ char: "s", description: "Save output to dataDir" }),
  profile: flg.string({ char: "P", description: "Use a profile" }),
  ...cli.table.flags({ only: ["extended", "output"] }),
}

module.exports = ListCommand
