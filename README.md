frtz
====

A cli to access your FRITZ!Box configuration without using the web UI

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
frtz/0.1.0 win32-x64 node-v10.14.1
$ frtz --help [COMMAND]
USAGE
  $ frtz COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`frtz devices:list`](#frtz-deviceslist)
* [`frtz help [COMMAND]`](#frtz-help-command)
* [`frtz setup`](#frtz-setup)

## `frtz devices:list`

list network devices.

```
USAGE
  $ frtz devices:list

OPTIONS
  -P, --profile=profile    Use a profile
  -h, --host=host          Set hostname
  -p, --password=password  Set password
  -s, --save               Save output to dataDir
  -u, --user=user          Set username
  -x, --extended           show extra columns
  --output=csv|json|yaml   output in a more machine friendly format
```

_See code: [src\commands\devices\list.js](https://github.com/vaaski/frtz/blob/v0.1.0/src\commands\devices\list.js)_

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

## `frtz setup`

Save configuration for fast access

```
USAGE
  $ frtz setup

OPTIONS
  -P, --profile=profile    Save it to a profile
  -h, --host=host          Set hostname
  -p, --password=password  Set password
  -u, --username=username  Set username

DESCRIPTION
  This saves:
  -Hostname
  -Username
  -Password (optional)

  You can also save it to a specific profile.
```

_See code: [src\commands\setup.js](https://github.com/vaaski/frtz/blob/v0.1.0/src\commands\setup.js)_
<!-- commandsstop -->
