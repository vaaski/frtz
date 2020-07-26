/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
const { read, write } = require("fs-jetpack")
const { execSync } = require("child_process")

const stopper = "<!-- commandsstop -->"

// eslint-disable-next-line no-unused-expressions
!(async () => {
  const gitStatus = execSync("git status --porcelain").toString().split("\n")
  const unstaged = gitStatus.find(s => {
    return s.startsWith(" ") && s.endsWith("README.md")
  })
  if (unstaged) return execSync(`git add README.md`)

  const data = read("./README.md")
  if (/\\/g.test(data) || data.endsWith(stopper + "\n")) {
    const stopIndex = data.indexOf(stopper) + stopper.length + 1
    const dataOut = data.slice(0, stopIndex).replace(/\\/g, "/")
    write("./README.md", dataOut)
    // process.exit(1)
  }
})()
