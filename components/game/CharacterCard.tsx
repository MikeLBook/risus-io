import { Character } from "@/models/Character"
import GameCard from "./GameCard"

interface CharacterCardProps {
  character: Character
}
export default function CharacterCard({ character }: CharacterCardProps) {
  const footer = (
    <div className="flex-row" style={{ justifyContent: "space-between", width: "100%" }}>
      <p>Created: {new Date(character.createdAt).toLocaleDateString()}</p>
      <p>Last Played: {new Date(character.updatedAt).toLocaleDateString()}</p>
    </div>
  )

  return (
    <GameCard
      title={character.name}
      description={character.description}
      footer={footer}
      leftJustify
    >
      {""}
    </GameCard>
  )
}
