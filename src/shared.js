const path = require("path")
const { auth } = require("frtz-core")
const chalk = require("chalk")
const { read, write } = require("fs-jetpack")

const readFile = p => {
  // this is a wrapper
  // that also just returns an empty object
  // insead of an error.
  return new Promise(res => {
    const r = read(p, "json")
    if (r) res(r)
    else res({})
  })
}

const extendLogin = async (t, profile = "default") => {
  const loginCache = await readFile(
    path.join(t.config.cacheDir, `loginCache-${profile}.json`)
  )
  write(path.join(t.config.cacheDir, `loginCache-${profile}.json`), {
    ...loginCache,
    expires: Date.now() + 1200e3,
  })
}

const login = async (options, t, profile = "default") => {
  const loginCache = await readFile(
    path.join(t.config.cacheDir, `loginCache-${profile}.json`)
  )
  if (loginCache[profile] && loginCache[profile].expires > Date.now())
    return { ...loginCache[profile], cached: true }

  const _login = await auth.login(options)
  write(path.join(t.config.cacheDir, `loginCache-${profile}.json`), {
    ...loginCache,
    [profile]: _login,
  })
  return _login
}

const grey = chalk.hex("#888")

const objArrToTable = (arr, head) => {
  head = head || Object.keys(arr[0])
  return {
    head: head.map(h => grey(h)),
    content: arr.map(a => {
      const aa = []
      head.forEach(h => aa.push(a[h]))
      return aa
    }),
  }
}

module.exports = {
  readFile,
  login,
  extendLogin,
  objArrToTable,
  grey,
  ipRegex: /^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
  macRegex: /^[a-fA-F0-9:]{17}|[a-fA-F0-9]{12}$/,
  conf: (t, p = "default") => path.join(t.config.configDir, `config-${p}.json`),
  cache: (t, p = "default") => path.join(t.config.cacheDir, `cache-${p}.json`),
}
