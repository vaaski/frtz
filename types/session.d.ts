export type LoginResponse = {
  "?xml": string
  SessionInfo: LoginResponseSessionInfo
}

export type LoginResponseSessionInfo = {
  SID: number | string
  Challenge: string
  BlockTime: number
  Rights: RightsClass | string
  Users: Users
}

export type RightsClass = {
  Name: string[]
  Access: number[]
}

export type Users = {
  User: string[]
}

export type ChallengeResponse = {
  "?xml": string
  SessionInfo: ChallengeResponseSessionInfo
}

export type ChallengeResponseSessionInfo = {
  SID: number
  Challenge: string
  BlockTime: number
  Rights: string
  Users: Users
}
