"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCharacters } from "@/contexts/CharactersContext"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Characters() {
  const { signOut } = useAuth()
  const { characters, filters, toggleUserOnly } = useCharacters()

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
        <div className="min-w-3/4">
          <div style={{ marginLeft: "64px", marginTop: "8px" }}>
            <div className="flex-row justify-space-between">
              <strong style={{ fontSize: "32px" }}>Characters</strong>
              <DropdownMenu>
                <Button asChild>
                  <DropdownMenuTrigger>Filters</DropdownMenuTrigger>
                </Button>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => toggleUserOnly()}>
                    {filters.userOnly ? "Show All Characters" : "Show My Characters"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="character-cards-container">
              <CharacterCreationForm>
                <GameCard
                  title="Create New Character"
                  description="A character can only be part of one campaign at a time"
                >
                  <div className="flex-column align-items-center mt-5">
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
