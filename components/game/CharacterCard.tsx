import { Character } from "@/models/Character"
import GameCard from "./GameCard"

interface CharacterCardProps {
  character: Character
}
export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <GameCard title={character.name} description={character.description}>
      <p>More Character Stuff Here</p>
    </GameCard>
  )
}
