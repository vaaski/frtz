<p align="center">
  <a href="https://github.com/vaaski/frtz" target="_blank">
    <img src="https://colo.vaaski.com/static/frtz.svg">
  </a>
</p>
<hr>

<p align="center">
  Access your FRITZ!Box configuration from the command line without using it's web UI.
</p>

<p align="center">
  <a href="https://npmjs.org/package/frtz" alt="version">
    <img src="https://img.shields.io/npm/v/frtz.svg?style=for-the-badge">
  </a>
  <a href="https://github.com/vaaski/frtz-core" alt="uses frtz-core">
    <img src="https://img.shields.io/badge/USES-FRTZ--CORE-3E2E50?style=for-the-badge">
  </a>
  <a href="https://npmjs.org/package/frtz" alt="downloads">
    <img src="https://img.shields.io/npm/dw/frtz.svg?style=for-the-badge">
  </a>
  <a href="https://github.com/vaaski/frtz/blob/master/package.json" alt="license">
    <img src="https://img.shields.io/npm/l/frtz.svg?style=for-the-badge">
  </a>
  <a href="https://oclif.io" alt="made with oclif">
    <img src="https://img.shields.io/badge/cli-oclif-brightgreen.svg?style=for-the-badge">
  </a>
</p>

* [Usage](#usage)
* [Commands](#commands)

# Usage

```sh-session
$ npm install -g frtz

$ frtz setup # this saves your hostname, username and optionally password to the config file
$ frtz devices:list # list network devices

$ frtz --help devices:list
List both online and offline devices.

USAGE
  $ frtz devices:list

OPTIONS
  -P, --profile=profile    use a profile
  -h, --host=host          set hostname
  -p, --password=password  set password
  -s, --save               save output to dataDir
  -u, --user=user          set username
  -x, --extended           show extra columns
  --output=csv|json|yaml   output in a more machine friendly format

ALIASES
  $ frtz list
  $ frtz l

EXAMPLE
  $ frtz list -s -x -P work
```

# Commands

<!-- commands -->
* [`frtz devices:list`](#frtz-deviceslist)
* [`frtz devices:wake DEVICE`](#frtz-deviceswake-device)
* [`frtz help [COMMAND]`](#frtz-help-command)
* [`frtz setup`](#frtz-setup)

## `frtz devices:list`

List both online and offline devices.

```
USAGE
  $ frtz devices:list

OPTIONS
  -P, --profile=profile    use a profile
  -h, --host=host          set hostname
  -p, --password=password  set password
  -s, --save               save output to dataDir
  -u, --username=username  set username
  -x, --extended           show extra columns
  --output=csv|json|yaml   output in a more machine friendly format

ALIASES
  $ frtz list
  $ frtz l

EXAMPLE
  $ frtz list -s -x -P work
```

_See code: [src\commands\devices\list.js](https://github.com/vaaski/frtz/blob/v0.3.0/src\commands\devices\list.js)_

## `frtz devices:wake DEVICE`

Wake a device from sleep with your FRITZ!Box

```
USAGE
  $ frtz devices:wake DEVICE

ARGUMENTS
  DEVICE  The device to wake. Can be IP address, hostname or mac address.

OPTIONS
  -P, --profile=profile    use a profile
  -h, --host=host          set hostname
  -p, --password=password  set password
  -u, --username=username  set username

ALIASES
  $ frtz wake
  $ frtz w

EXAMPLES
  $ frtz wake 127.0.0.1
  $ frtz w mycomputer
```

_See code: [src\commands\devices\wake.js](https://github.com/vaaski/frtz/blob/v0.3.0/src\commands\devices\wake.js)_

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
  -P, --profile=profile    save to a profile
  -h, --host=host          set hostname
  -p, --password=password  set password
  -u, --username=username  set username

DESCRIPTION
  This saves:
  -Hostname
  -Username
  -Password (optional)

  You can also save it to a specific profile using -P.
```

_See code: [src\commands\setup.js](https://github.com/vaaski/frtz/blob/v0.3.0/src\commands\setup.js)_
<!-- commandsstop -->
