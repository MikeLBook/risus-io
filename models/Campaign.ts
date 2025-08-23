export interface Campaign {
  id: string
  ownerId: string
  log: LogMessage[]
  characterIds: string[]
}

export interface LogMessage {
  id: string
  campaignId: string
  message: string
  timestamp: number
}
