"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCharacters } from "@/contexts/charactersContext"
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"
import "./landing-page.css"
import CharacterCard from "@/components/game/CharacterCard"
import Card from "@/components/game/Card"
import Image from "next/image"

import CharacterCreationForm from "@/components/game/CharacterCreationForm"

export default function Home() {
  const { characters } = useCharacters()

  return (
    <div style={{ display: "flex" }}>
      <Sidebar>
        <SidebarHeader className="grey-bg">
          <strong style={{ fontSize: "large" }}>Game Browser</strong>
        </SidebarHeader>
        <SidebarContent className="grey-bg">
          <Button asChild style={{ marginLeft: "8px", marginRight: "8px" }}>
            <Link href="/campaigns/1">Join Game</Link>
          </Button>
        </SidebarContent>
      </Sidebar>
      <div>
        <div style={{ marginLeft: "64px", marginTop: "8px" }}>
          <strong style={{ fontSize: "32px" }}>Characters</strong>
          <div className="character-cards-container">
            <CharacterCreationForm>
              <Card
                title="Create New Character"
                description="A character can only be part of one campaign at a time"
              >
                <div className="flex-column-component">
                  <Image
                    src="/images/circle-plus.svg"
                    alt="Circle-Plus"
                    width="50"
                    height="50"
                    color="white"
                  ></Image>
                </div>
              </Card>
            </CharacterCreationForm>
            {characters.map((char, idx) => (
              <CharacterCard key={char.id + idx} character={char} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
