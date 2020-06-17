const { Command, flags: flg } = require("@oclif/command")
const Table = require("cli-table3")
const chalk = require("chalk")
const { read, listAsync } = require("fs-jetpack")
const { conf, objArrToTable } = require("../../shared")

class ProfilesCommand extends Command {
  async run() {
    const { flags } = this.parse(ProfilesCommand)
    const confRegex = /config-(\w+).json/
    const tableContent = ["name", "host", "username"]
    let colWidths = []

    if (flags.showPassword) {
      tableContent.push("password")
      colWidths = [null, 30]
    }

    const configList = await listAsync(this.config.configDir)
    const configs = configList
      .filter(f => confRegex.test(f))
      .map(c => confRegex.exec(c)[1])
      .map(name => ({ ...read(conf(this, name), "json"), name }))

    const { head, content } = objArrToTable(configs, tableContent)
    const table = new Table({
      head,
      colWidths,
    })
    content.forEach(p => table.push(p))

    this.log("\n " + chalk.underline("saved profiles"))
    this.log(table.toString())
  }
}

ProfilesCommand.description = `Lists the configured profiles`

ProfilesCommand.flags = {
  showPassword: flg.boolean({ char: "p", description: "display password" }),
}

ProfilesCommand.aliases = ["listprofiles", "profiles", "lp"]

module.exports = ProfilesCommand
