import { Cliche } from "./Character"

export interface Campaign {
  id: string
  dmId: string
  dmName: string
  title: string
  description: string
  createdDate: number
  updatedDate: number

  // Game state fields
  gameMode: GameMode
  gameData: GameModeData
  luckyShots: LuckyShotAllotments
}

export interface LuckyShotAllotments {
  [key: string]: number // Allows resetting lucky shot counts per character ID
}

export type GameMode = "GM_CONTROL" | "TARGET_ROLL" | "CONTESTED_ROLL" | "COMBAT"

export type GameModeData = GMControlData | TargetRollData | ContestedRollData | CombatData

export interface GMControlData {
  type: "GM_CONTROL"
  phase: "NARRATIVE" | "PREP" | "WAITING" | "PLAYING"
  title?: string // e.g. "Setting the Scene", "Planning encounter"
}

export interface TargetRollData {
  type: "TARGET_ROLL"
  phase: "WAITING_FOR_ROLL" | "ROLLING_ANIMATION" | "ROLL_RESULT"
  title: string // e.g. "Roll Perception", "Sneak Past Guards"
  currentCharacterId: string // Who needs to roll
  targetNumber: number
  targetVisible: boolean // Whether players can see the target
  selectedCliche: Cliche
  usedLuckyShot: boolean
  rollResult?: RollResult
  success?: boolean
}

export interface ContestedRollData {
  type: "CONTESTED_ROLL"
  phase:
    | "WAITING_FOR_CHARACTER_1"
    | "CHARACTER_1_ROLLING"
    | "CHARACTER_1_RESULT"
    | "WAITING_FOR_CHARACTER_2"
    | "CHARACTER_2_ROLLING"
    | "CHARACTER_2_RESULT"
  title: string // e.g. "Arm Wrestling Contest", "Stealth vs Perception"
  characters: [
    {
      id: string
      selectedCliche: Cliche
      order: number
      usedLuckyShot: boolean
      rollResult?: RollResult
    },
    {
      id: string
      selectedCliche: Cliche
      order: number
      usedLuckyShot: boolean
      rollResult?: RollResult
    }
  ]
  winner?: string
}

export interface CombatData {
  // TODO
  type: "COMBAT"
  phase: "TODO"
  title: string
}

interface RollResult {
  values: number[]
  total: number
  rolledAt: string
}
