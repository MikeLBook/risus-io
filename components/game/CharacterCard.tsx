import { Character } from "@/models/Character"
import Card from "./Card"

interface CharacterCardProps {
  character: Character
}
export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Card title={character.name} description={character.description}>
      <p>More Character Stuff Here</p>
    </Card>
  )
}
