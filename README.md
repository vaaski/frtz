frtz
====

a cli to access your FRITZ!Box configuration without using the web UI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/frtz.svg)](https://npmjs.org/package/frtz)
[![Downloads/week](https://img.shields.io/npm/dw/frtz.svg)](https://npmjs.org/package/frtz)
[![License](https://img.shields.io/npm/l/frtz.svg)](https://github.com/vaaski/frtz/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g frtz
$ frtz COMMAND
running command...
$ frtz (-v|--version|version)
frtz/0.0.1 win32-x64 node-v10.14.1
$ frtz --help [COMMAND]
USAGE
  $ frtz COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`frtz help [COMMAND]`](#frtz-help-command)
* [`frtz network:devices [ACTION]`](#frtz-networkdevices-action)
* [`frtz setup`](#frtz-setup)

## `frtz help [COMMAND]`

display help for frtz

```
USAGE
  $ frtz help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.0.1/src\commands\help.ts)_

## `frtz network:devices [ACTION]`

interact with network devices

```
USAGE
  $ frtz network:devices [ACTION]

ARGUMENTS
  ACTION  [default: list] what to do with network devices

OPTIONS
  -h, --host=host          set hostname
  -p, --password=password  set password
  -s, --save               save output to dataDir
  -u, --user=user          set username
  -x, --extended           show extra columns
  --output=csv|json|yaml   output in a more machine friendly format

DESCRIPTION
  provide an argument to choose an action for the network devices
  choose from:
  - list
```

_See code: [src\commands\network\devices.js](https://github.com/vaaski/frtz/blob/v0.0.1/src\commands\network\devices.js)_

## `frtz setup`

save configuration for fast access

```
USAGE
  $ frtz setup

OPTIONS
  -h, --host=host          set hostname
  -p, --password=password  set password
  -u, --username=username  set username

DESCRIPTION
  save:
  -hostname
  -username
  -password (optional)
```

_See code: [src\commands\setup.js](https://github.com/vaaski/frtz/blob/v0.0.1/src\commands\setup.js)_
<!-- commandsstop -->
