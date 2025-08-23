export interface Character {
  id: string
  userId: string
  campaignId?: string
  name: string
  description: string
  totalDice: number
  cliches: Cliche[]
  luckyShots: number
  hasHook: boolean
  hookText: string
  hasTale: boolean
  taleText: string
  deceased: boolean
  archived: boolean
  createdAt: number
  updatedAt: number
}

export interface Cliche {
  id: string
  name: string
  dice: number
  injury: number
}
