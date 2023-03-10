export type List = {
  pid: string
  hide: { [key: string]: boolean }
  time: unknown[]
  data: Data
  sid: string
}

export type Data = {
  fbox: Fbox[]
  ipclient: boolean
  isrepeater: boolean
  titledevicedel: string
  fbox_other: unknown[]
  active: Ive[]
  backToPage: string
  countpassive?: number
  passive: Ive[]
  ispowerline: boolean
  titledeviceadd: string
  fbox_title: string
  initial: boolean
  nexusclient: boolean
}

export type Ive = {
  mac: string
  type: Classes
  conn_info: unknown[]
  parent: Parent
  properties: ActiveProperty[]
  options: Options
  UID: string
  state: State
  port: Port
  name: string
  model: Model
  url: string
  classes: Classes
  ipv4: Ipv4
}

export type Classes = "ethernet" | "wlan" | "unknown"

export type Ipv4 = {
  _node: Node
  addrtype: Addrtype
  dhcp: string
  lastused?: string
  ip: string
}

export type Node = "entry0"

export type Addrtype = "IPv4"

export type Model = "active" | "passive"

export type Options = {
  guest: boolean
  editable: boolean
  deleteable: boolean
  disable: boolean
}

export type Parent = {
  name: string
  url: string
}

export type Port = "LAN 2 mit 1 Gbit/s " | "LAN 1 mit 1 Gbit/s " | "WLAN" | ""

export type ActiveProperty = {
  onclick: Onclick
  txt: string
  icon?: string
  link: string
  svg?: string
  class?: string
}

export type Onclick = "portoverview" | "show_prio" | ""

export type State = "globe_online" | "led_green" | ""

export type Fbox = {
  mac: string
  type: Classes
  conn_info: unknown[]
  parent: Parent
  properties: FboxProperty[]
  options: Options
  UID: string
  state: State
  port: string
  name: string
  model: string
  url: string
  classes: Classes
  ipv4: Ipv4
}

export type FboxProperty = {
  txt: string
}
