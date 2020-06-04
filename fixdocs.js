const fs = require("fs")

fs.readFile("./README.md", (err, data) => {
  const d = data.toString().replace(/\\/g, "/")
  fs.writeFileSync("./README.md", d)
})
