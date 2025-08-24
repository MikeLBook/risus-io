"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCharacters } from "@/contexts/charactersContext"
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar"
import "./characters.css"
import CharacterCard from "@/components/game/CharacterCard"
import GameCard from "@/components/game/GameCard"
import Image from "next/image"
import CharacterSheet from "@/components/game/CharacterSheet"
import CharacterCreationForm from "@/components/game/CharacterCreationForm"
import { useAuth } from "@/hooks/useAuth"

export default function Characters() {
  const { signOut } = useAuth()
  const { characters } = useCharacters()

  return (
    <SidebarProvider defaultOpen={true}>
      <div style={{ display: "flex" }} className="grey-bg min-w-screen">
        <Sidebar>
          <SidebarHeader className="grey-bg">
            <strong style={{ fontSize: "large" }}>Game Browser</strong>
          </SidebarHeader>
          <SidebarContent className="grey-bg">
            <Button asChild style={{ marginLeft: "8px", marginRight: "8px" }}>
              <Link href="/campaigns/1">Join Game</Link>
            </Button>
            <Button asChild onClick={signOut} style={{ marginLeft: "8px", marginRight: "8px" }}>
              <Link href="/">Sign Out</Link>
            </Button>
          </SidebarContent>
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
                  <div className="flex-column-component flex-column-centered">
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
