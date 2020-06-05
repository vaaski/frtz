const { Command, flags: flg } = require("@oclif/command")
const fs = require("fs")
const { network } = require("frtz-core")
const { cli } = require("cli-ux")
const {
  conf,
  readFile,
  login,
  extendLogin,
  ipRegex,
  macRegex,
  cache,
} = require("../../shared")

class WakeCommand extends Command {
  async run() {
    const { flags, args } = this.parse(WakeCommand)
    let config = await readFile(conf(this, flags.profile))
    config = { ...flags, ...config }

    if (!config.password)
      this.error(
        "a password must be provided either as a flag or via setup config (run frtz setup)"
      )

    let device
    const findDevice = devices => {
      if (ipRegex.test(args.device))
        return devices.filter(d => d.ipv4 === args.device)[0]

      if (macRegex.test(args.device))
        return devices.filter(d => d.mac === args.device)[0]

      return devices.filter(d => d.name === args.device)[0]
    }

    const deviceCache = JSON.parse(fs.readFileSync(cache(this, flags.profile)))
    const foundInCache = findDevice(deviceCache.devices)

    if (foundInCache) device = foundInCache
    else {
      this.log("no matching device found in cache, refreshing device list.")
      const loginStarted = Number(new Date())
      cli.action.start("logging in")
      const { cached, SID } = await login(config, this, flags.profile)
      const loginTime = Number(new Date()) - loginStarted
      cli.action.stop(
        `logged in ${cached ? "from cache " : ""}(${Number(
          (loginTime / 1000).toFixed(2)
        )}s)`
      )

      const listStarted = Number(new Date())
      cli.action.start("getting device list, please be paitent")
      const data = await network.getDevices({ SID, host: config.host })
      await extendLogin(this, flags.profile)
      const listTime = Number(new Date()) - listStarted
      cli.action.stop(`got list (${Number((listTime / 1000).toFixed(2))}s)`)

      device = findDevice([...data.active, ...data.passive])

      const oldCache = await readFile(cache(this, flags.profile))
      const cacheData = {
        ...oldCache,
        devices: [...data.active, ...data.passive],
      }
      fs.writeFileSync(cache(this, flags.profile), JSON.stringify(cacheData))
    }

    if (!device) return this.error("no matching device found.")

    try {
      const loginStarted = Number(new Date())
      cli.action.start("logging in")
      const { cached, SID } = await login(config, this, flags.profile)
      const loginTime = Number(new Date()) - loginStarted
      cli.action.stop(
        `logged in ${cached ? "from cache " : ""}(${Number(
          (loginTime / 1000).toFixed(2)
        )}s)`
      )

      const wakeStarted = Number(new Date())
      cli.action.start(`waking device: ${device.name}`)
      const woken = await network.wake({ UID: device.UID, SID, ...config })
      await extendLogin(this, flags.profile)
      const wakeTime = Number(new Date()) - wakeStarted
      if (woken)
        cli.action.stop(
          `wake request has been sent (${Number(
            (wakeTime / 1000).toFixed(2)
          )}s)`
        )
      else
        cli.action.stop(
          `wake request has failed (${Number((wakeTime / 1000).toFixed(2))}s)`
        )
    } catch (error) {
      cli.action.stop("error")
      this.error(error)
    }
  }
}

WakeCommand.description = `Wake a device from sleep with your FRITZ!Box`

WakeCommand.aliases = ["wake", "w"]

WakeCommand.examples = ["$ frtz wake 127.0.0.1", "$ frtz w mycomputer"]

WakeCommand.args = [
  {
    name: "device",
    required: true,
    description:
      "The device to wake. Can be IP address, hostname or mac address.",
  },
]

WakeCommand.flags = {
  host: flg.string({ char: "h", description: "set hostname" }),
  username: flg.string({ char: "u", description: "set username" }),
  password: flg.string({ char: "p", description: "set password" }),
  profile: flg.string({ char: "P", description: "use a profile" }),
}

module.exports = WakeCommand
