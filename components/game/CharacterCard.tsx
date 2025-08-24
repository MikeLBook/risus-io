import { Character } from "@/models/Character"
import GameCard from "./GameCard"

interface CharacterCardProps {
  character: Character
}
export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <GameCard title={character.name} description={character.description} leftJustify>
      <div className="flex-component" style={{ justifyContent: "space-between" }}>
        <p>Created: {new Date(character.createdAt).toLocaleDateString()}</p>
        <p>Last Played: {new Date(character.updatedAt).toLocaleDateString()}</p>
      </div>
    </GameCard>
  )
}
