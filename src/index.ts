import type { FetchOptions } from "ofetch"
import type { Session } from "../types"

import { pbkdf2Sync } from "node:crypto"
import { ofetch } from "ofetch"
import { XMLParser } from "fast-xml-parser"

export class FritzBox {
  private readonly parser = new XMLParser()
  private fett: typeof ofetch

  constructor(public readonly host = "http://fritz.box") {
    this.fett = ofetch.create({ baseURL: this.host })
  }

  private xmlRequest = async <T>(address: string, options?: FetchOptions) => {
    const response = await this.fett(address, options)
    const parsed: T = this.parser.parse(response)

    return parsed
  }

  challengePBKDF2 = async (password: string) => {
    const request = await this.xmlRequest<Session.ChallengeResponse>("login_sid.lua", {
      params: { version: 2 },
    })

    const [, iter1, salt1, iter2, salt2] = request.SessionInfo.Challenge.split("$")
    if (!iter1 || !salt1 || !iter2 || !salt2) {
      throw new Error("Could not parse challenge")
    }

    const hash1 = pbkdf2Sync(
      password,
      Buffer.from(salt1, "hex"),
      Number.parseInt(iter1),
      32,
      "sha256"
    )
    const hash2 = pbkdf2Sync(
      hash1,
      Buffer.from(salt2, "hex"),
      Number.parseInt(iter2),
      32,
      "sha256"
    )

    return `${salt2}$${hash2.toString("hex")}`
  }

  public login = async (password: string, username?: string) => {
    const response = await this.challengePBKDF2(password)

    const loginParameters = new URLSearchParams({ response })
    if (username) loginParameters.set("username", username)

    const loginResponse = await this.xmlRequest<Session.LoginResponse>("login_sid.lua", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      params: { version: 2 },
      body: loginParameters,
    })

    return loginResponse
  }
}
