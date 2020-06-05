const path = require("path")
const fs = require("fs")
const { auth } = require("frtz-core")

const readFile = (...arg) => {
  // this is a promise wrapper
  // that also just returns an empty object
  // in case of an error.
  return new Promise(res => {
    fs.readFile(...arg, (err, data) => {
      if (err) res({})
      else res(JSON.parse(data))
    })
  })
}

const extendLogin = async (t, profile = "default") => {
  const loginCache = await readFile(
    path.join(t.config.cacheDir, `loginCache-${profile}.json`)
  )
  fs.writeFileSync(
    path.join(t.config.cacheDir, `loginCache-${profile}.json`),
    JSON.stringify({ ...loginCache, expires: Date.now() + 1200e3 })
  )
}

const login = async (options, t, profile = "default") => {
  const loginCache = await readFile(
    path.join(t.config.cacheDir, `loginCache-${profile}.json`)
  )
  if (loginCache[profile] && loginCache[profile].expires > Date.now())
    return { ...loginCache[profile], cached: true }

  const _login = await auth.login(options)
  fs.writeFileSync(
    path.join(t.config.cacheDir, `loginCache-${profile}.json`),
    JSON.stringify({ ...loginCache, [profile]: _login })
  )
  return _login
}

module.exports = {
  readFile,
  login,
  extendLogin,
  conf: (t, p = "default") => path.join(t.config.configDir, `config-${p}.json`),
  cache: (t, p = "default") => path.join(t.config.cacheDir, `cache-${p}.json`),
}
