"use client"

import { Character } from "@/models/Character"
import { createContext, useContext, useState } from "react"

interface ICharactersContext {
  characters: Character[]
  addCharacter: (character: Character) => void
}
const CharactersContext = createContext<ICharactersContext>({
  characters: [],
  addCharacter: () => {},
})

interface CharactersProviderProps {
  children: React.ReactNode
}
export function CharactersProvider({ children }: CharactersProviderProps) {
  const [characters, setCharacters] = useState<Character[]>([])

  const addCharacter = (character: Character) => {
    const clonedCharacters = structuredClone(characters)
    clonedCharacters.push(character)
    setCharacters(clonedCharacters)
  }

  const value = {
    characters,
    addCharacter,
  }

  return <CharactersContext.Provider value={value}>{children}</CharactersContext.Provider>
}

export const useCharacters = () => useContext(CharactersContext)

export default CharactersContext
