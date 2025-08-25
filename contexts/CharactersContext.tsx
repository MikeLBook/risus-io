"use client"

import { Character } from "@/models/Character"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { createContext, useContext, useState, useEffect } from "react"

interface CharacterFilters {
  userOnly: boolean
  deceased?: boolean // undefined = all, true = deceased only, false = alive only
}

interface ICharactersContext {
  characters: Character[]
  filters: CharacterFilters
  addCharacter: (character: Character) => Promise<void>
  toggleUserOnly: () => void
  setDeceasedFilter: (deceased?: boolean) => void
}

const CharactersContext = createContext<ICharactersContext>({
  characters: [],
  filters: { userOnly: true, deceased: undefined },
  addCharacter: async () => {},
  toggleUserOnly: () => {},
  setDeceasedFilter: () => {},
})

interface CharactersProviderProps {
  children: React.ReactNode
}

export function CharactersProvider({ children }: CharactersProviderProps) {
  const { user } = useAuth()
  const [characters, setCharacters] = useState<Character[]>([])
  const [filters, setFilters] = useState<CharacterFilters>({
    userOnly: true,
    deceased: undefined,
  })
  const supabase = createClient()

  const addCharacter = async (character: Character) => {
    if (!user) return

    const { error } = await supabase.from("characters").insert([
      {
        user_id: user.id,
        creator_name: character.creatorName,
        campaign_id: character.campaignId,
        name: character.name,
        description: character.description,
        cliches: character.cliches,
        lucky_shots: character.luckyShots,
        has_hook: character.hasHook,
        hook_text: character.hookText,
        has_tale: character.hasTale,
        tale_text: character.taleText,
        tools: character.tools,
        deceased: character.deceased,
        archived: character.archived,
      },
    ])

    if (error) {
      console.error("Error adding character:", error)
    }
  }

  const toggleUserOnly = () => {
    setFilters((prev) => ({ ...prev, userOnly: !prev.userOnly }))
  }

  const setDeceasedFilter = (deceased?: boolean) => {
    setFilters((prev) => ({ ...prev, deceased }))
  }

  useEffect(() => {
    if (!user) {
      setCharacters([])
      return
    }

    const fetchCharacters = async () => {
      let query = supabase.from("characters").select("*")

      if (filters.userOnly && user) {
        query = query.eq("user_id", user.id)
      }

      if (filters.deceased !== undefined) {
        query = query.eq("deceased", filters.deceased)
      }

      query = query.order("created_at", { ascending: false })

      const { data, error } = await query

      if (error) {
        console.error("Error fetching characters:", error)
        return
      }

      const mappedCharacters: Character[] = (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        creatorName: row.creator_name,
        campaignId: row.campaign_id,
        name: row.name,
        description: row.description,
        cliches: row.cliches,
        luckyShots: row.lucky_shots,
        hasHook: row.has_hook,
        hookText: row.hook_text,
        hasTale: row.has_tale,
        taleText: row.tale_text,
        tools: row.tools,
        deceased: row.deceased,
        archived: row.archived,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }))

      setCharacters(mappedCharacters)
    }

    fetchCharacters()

    const channel = supabase.channel("characters-subscription").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "characters",
      },
      (payload) => {
        fetchCharacters()
      }
    )

    channel.subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user, filters, supabase])

  const value = {
    characters,
    filters,
    addCharacter,
    toggleUserOnly,
    setDeceasedFilter,
  }

  return <CharactersContext.Provider value={value}>{children}</CharactersContext.Provider>
}

export const useCharacters = () => useContext(CharactersContext)

export default CharactersContext
