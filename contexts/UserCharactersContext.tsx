"use client"

import { Character } from "@/models/Character"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth" // Adjust path as needed
import { createContext, useContext, useState, useEffect } from "react"

interface IUserCharactersContext {
  characters: Character[]
  addCharacter: (character: Character) => Promise<void>
}

const UserCharactersContext = createContext<IUserCharactersContext>({
  characters: [],
  addCharacter: async () => {},
})

interface UserCharactersProviderProps {
  children: React.ReactNode
}

export function UserCharactersProvider({ children }: UserCharactersProviderProps) {
  const { user } = useAuth()
  const [characters, setCharacters] = useState<Character[]>([])
  const supabase = createClient()

  const addCharacter = async (character: Character) => {
    if (!user) return

    // Add to database
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

  // Subscribe to characters created by this user
  useEffect(() => {
    if (!user) {
      setCharacters([])
      return
    }

    // Fetch initial characters
    const fetchCharacters = async () => {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching characters:", error)
        return
      }

      // Convert database format to Character interface
      const mappedCharacters: Character[] = data.map((row) => ({
        id: row.id,
        userId: row.user_id,
        creatorName: row.creator_name,
        campaignId: row.campaign_id,
        name: row.name,
        description: row.description,
        cliches: row.cliches || [],
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

    // Set up real-time subscription
    const channel = supabase
      .channel("user-characters")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "characters",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newCharacter: Character = {
              id: payload.new.id,
              userId: payload.new.user_id,
              creatorName: payload.new.creator_name,
              campaignId: payload.new.campaign_id,
              name: payload.new.name,
              description: payload.new.description,
              cliches: payload.new.cliches || [],
              luckyShots: payload.new.lucky_shots,
              hasHook: payload.new.has_hook,
              hookText: payload.new.hook_text,
              hasTale: payload.new.has_tale,
              taleText: payload.new.tale_text,
              tools: payload.new.tools,
              deceased: payload.new.deceased,
              archived: payload.new.archived,
              createdAt: payload.new.created_at,
              updatedAt: payload.new.updated_at,
            }
            setCharacters((prev) => [newCharacter, ...prev])
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user, supabase])

  const value = {
    characters,
    addCharacter,
  }

  return <UserCharactersContext.Provider value={value}>{children}</UserCharactersContext.Provider>
}

export const useUserCharacters = () => useContext(UserCharactersContext)

export default UserCharactersContext
