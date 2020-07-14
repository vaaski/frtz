const { Command, flags: flg } = require("@oclif/command")
const { write } = require("fs-jetpack")
const path = require("path")
const Table = require("cli-table3")
const chalk = require("chalk")
const { network } = require("frtz-core")
const { cli } = require("cli-ux")
const {
  conf,
  cache,
  readFile,
  login,
  extendLogin,
  objArrToTable,
  grey,
} = require("../../shared")

class ListCommand extends Command {
  async run() {
    const { flags } = this.parse(ListCommand)
    let config = await readFile(conf(this, flags.profile))
    config = { ...flags, ...config }
    let tableContent = ["name", "ipv4", "mac"]

    if (flags.extended)
      tableContent = ["name", "ipv4", "ipv6", "type", "speed", "mac"]

    if (!config.password)
      this.error(
        "a password must be provided either as a flag or via setup config (run frtz setup)"
      )

    this.log(grey(`using profile: ${config.profile || "default"}`))

    try {
      const loginStarted = Number(new Date())
      cli.action.start("logging in")
      const { cached, SID } = await login(config, this, flags.profile)
      const loginTime = Number(new Date()) - loginStarted
      cli.action.stop(
        grey(
          `logged in ${cached ? "from cache " : ""}(${Number(
            (loginTime / 1000).toFixed(2)
          )}s)`
        )
      )

      const listStarted = Number(new Date())
      cli.action.start("getting device list, please be paitent")
      const data = await network.getDevices({ SID, host: config.host })
      await extendLogin(this, flags.profile)
      const listTime = Number(new Date()) - listStarted
      cli.action.stop(
        grey(`got list (${Number((listTime / 1000).toFixed(2))}s)`)
      )
      this.log("")

      const outputTable = devices => {
        devices = devices.map(d => ({
          ...d,
          speed: d.port === "WLAN" ? d.sum_props : d.port,
        }))
        const { head, content } = objArrToTable(devices, tableContent)
        const table = new Table({
          head,
        })
        content.forEach(p => table.push(p))
        this.log(table.toString())
      }

      if (!flags.passive) {
        this.log(" " + chalk.underline("active devices"))
        outputTable(data.active)
      }
      if (!flags.active) {
        this.log("\n " + chalk.underline("passive devices"))
        outputTable(data.passive)
      }

      if (flags.save) {
        this.log("")
        const saveLocation = path.join(
          this.config.dataDir,
          "network-devices.json"
        )

        cli.action.start("saving list")

        write(saveLocation, data)
        cli.action.stop("saved")
        this.log(`saved to ${saveLocation}`)
      }

      const oldCache = await readFile(cache(this, flags.profile))
      const cacheData = {
        ...oldCache,
        devices: [...data.active, ...data.passive],
      }
      write(cache(this, flags.profile), cacheData)
    } catch (error) {
      cli.action.stop("error")
      this.error(error)
    }
  }
}

ListCommand.description = `List both online and offline devices.`

ListCommand.aliases = ["list", "l"]

ListCommand.examples = ["$ frtz list -s -x -P work"]

ListCommand.flags = {
  host: flg.string({ char: "h", description: "set hostname" }),
  username: flg.string({ char: "u", description: "set username" }),
  password: flg.string({ char: "p", description: "set password" }),
  save: flg.boolean({ char: "s", description: "save output to dataDir" }),
  profile: flg.string({ char: "P", description: "use a profile" }),
  active: flg.boolean({ description: "show only active devices" }),
  passive: flg.boolean({ description: "show only passive devices" }),
  extended: flg.boolean({
    char: "x",
    description: "show extended output (ipv6, connection type)",
  }),
}

module.exports = ListCommand
