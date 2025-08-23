import { Character } from "@/models/Character"

interface CharacterCardProps {
  character: Character
}
export default function CharacterCard({ character }: CharacterCardProps) {
  return <div>{character.name}</div>
}
