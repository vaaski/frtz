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
    Object.assign(config, flags)

    if (!config.password)
      this.error(
        "a password must be provided either as a flag or via setup config (run frtz setup)"
      )

    let login
    try {
      const loginStarted = Number(new Date())
      cli.action.start("logging in")
      login = await auth.login(config)
      const loginTime = Number(new Date()) - loginStarted
      cli.action.stop(`logged in (${Number((loginTime / 1000).toFixed(2))}s)`)

      const listStarted = Number(new Date())
      cli.action.start("getting device list, please be paitent")
      const data = await network.getDevices({
        SID: login.SID,
        host: config.host,
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
    } catch (error) {
      cli.action.stop()
      console.log(error)
    }
  }
}

ListCommand.description = `list network devices.`

ListCommand.args = []

ListCommand.flags = {
  host: flg.string({ char: "h", description: "set hostname" }),
  user: flg.string({ char: "u", description: "set username" }),
  password: flg.string({ char: "p", description: "set password" }),
  save: flg.boolean({ char: "s", description: "save output to dataDir" }),
  ...cli.table.flags({ only: ["extended", "output"] }),
}

module.exports = ListCommand
