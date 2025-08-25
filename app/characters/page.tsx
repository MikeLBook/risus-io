"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useUserCharacters } from "@/contexts/UserCharactersContext"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarFooter,
} from "@/components/ui/sidebar"
import "./characters.css"
import CharacterCard from "@/components/game/CharacterCard"
import GameCard from "@/components/game/GameCard"
import Image from "next/image"
import CharacterSheet from "@/components/game/CharacterSheet"
import CharacterCreationForm from "@/components/game/CharacterCreationForm"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"

export default function Characters() {
  const { signOut } = useAuth()
  const { characters } = useUserCharacters()

  useEffect(() => console.log("component", characters), [characters])

  return (
    <SidebarProvider defaultOpen={true}>
      <div style={{ display: "flex" }} className="grey-bg min-w-screen">
        <Sidebar>
          <SidebarHeader className="grey-bg">
            <strong style={{ fontSize: "large" }}>Active Campaigns</strong>
          </SidebarHeader>
          <SidebarContent className="grey-bg" style={{ justifyContent: "flex-end" }}>
            <div></div>
          </SidebarContent>
          <SidebarFooter className="grey-bg">
            <Button asChild style={{ margin: "8px" }}>
              <Link href="/campaigns">Create Campaign</Link>
            </Button>
            <Button asChild onClick={signOut} style={{ margin: "8px" }}>
              <Link href="/">Sign Out</Link>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div>
          <div style={{ marginLeft: "64px", marginTop: "8px" }}>
            <strong style={{ fontSize: "32px" }}>Characters</strong>
            <div className="character-cards-container">
              <CharacterCreationForm>
                <GameCard
                  title="Create New Character"
                  description="A character can only be part of one campaign at a time"
                >
                  <div className="flex-column-component flex-column-centered mt-5">
                    <Image
                      src="/images/circle-plus.svg"
                      alt="Circle-Plus"
                      width="50"
                      height="50"
                    ></Image>
                  </div>
                </GameCard>
              </CharacterCreationForm>
              {characters.map((char, idx) => (
                <CharacterSheet key={char.id + idx} character={char}>
                  <CharacterCard character={char} />
                </CharacterSheet>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
