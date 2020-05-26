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

class DevicesCommand extends Command {
  async run() {
    const { flags, args } = this.parse(DevicesCommand)
    const config = await readPromise(
      path.join(this.config.configDir, "config.json")
    )
    Object.assign(config, flags)

    if (!config.password)
      this.error(
        "a password must be provided either as a flag or via setup config (run frtz setup)"
      )

    let login
    try {
      cli.action.start("logging in")
      login = await auth.login(config)
      cli.action.stop("logged in")

      if (args.action === "list") {
        cli.action.start("getting device list, please be paitent")
        const data = await network.getDevices({
          SID: login.SID,
          host: config.host,
        })
        cli.action.stop("got list")

        const defaultTable = {
          name: { header: "active devices" },
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
            name: { header: "passive devices" },
          },
          flags
        )

        if (flags.save) {
          this.log("")
          cli.action.start(
            `saving list to ${path.join(
              this.config.dataDir,
              "network-devices.json"
            )}`
          )

          fs.writeFileSync(
            path.join(this.config.dataDir, "network-devices.json"),
            JSON.stringify(data)
          )
          cli.action.stop("saved")
        }
      }
    } catch (error) {
      cli.action.stop()
      console.log(error)
    }
  }
}

DevicesCommand.description = `interact with network devices
provide an argument to choose an action for the network devices
choose from:
- list
`

DevicesCommand.args = [
  {
    name: "action",
    default: "list",
    description: "what to do with network devices",
  },
]

DevicesCommand.flags = {
  host: flg.string({ char: "h", description: "set hostname" }),
  user: flg.string({ char: "u", description: "set username" }),
  password: flg.string({ char: "p", description: "set password" }),
  save: flg.boolean({ char: "s", description: "save output to dataDir" }),
  ...cli.table.flags({ only: ["extended", "output"] }),
}

module.exports = DevicesCommand
