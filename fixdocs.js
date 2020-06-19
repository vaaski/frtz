const { read, write } = require("fs-jetpack")

// eslint-disable-next-line no-unused-expressions
!(async () => {
  const data = read("./README.md").replace(/\\/g, "/")
  write("./README.md", data)
})()
