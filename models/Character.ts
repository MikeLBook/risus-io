export interface Character {
  id: string
  userId: string
  creatorName: string
  campaignId?: string
  name: string
  description: string
  cliches: Cliche[]
  luckyShots: number
  hasHook: boolean
  hookText: string
  hasTale: boolean
  taleText: string
  tools: string
  deceased: boolean
  archived: boolean
  createdAt: number
  updatedAt: number
}

export interface Cliche {
  id: string
  name: string
  description: string
  dice: number
  injuries: Injury[]
  isPrimary: boolean
}

export interface Injury {
  description: string
  penalty: number
}
