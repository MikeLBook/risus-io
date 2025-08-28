"use client"

import GameCard from "@/components/game/GameCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCampaigns } from "@/contexts/CampaignContext"
import { useAuth } from "@/hooks/useAuth"
import { Campaign } from "@/models/Campaign"
import { FormEvent, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/navigation"

export default function CreateCampaign() {
  const { user } = useAuth()
  const { addCampaign } = useCampaigns()
  const router = useRouter()

  const [campaignTitle, setCampaignTitle] = useState("")
  const [campaignDescription, setCampaignDescription] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    const now = Date.now()
    const newCampaign: Campaign = {
      id: uuidv4(),
      dmId: user?.id,
      dmName: user.user_metadata.full_name,
      title: campaignTitle,
      description: campaignDescription,
      createdDate: now,
      updatedDate: now,
      gameMode: "GM_CONTROL",
      gameData: {
        type: "GM_CONTROL",
        phase: "PREP",
      },
      luckyShots: {},
    }

    await addCampaign(newCampaign)
    router.push(`/characters`)
  }

  return (
    <div className="grey-bg min-h-screen min-w-screen flex-column justify-center">
      <GameCard
        title={"Create Campaign"}
        description={
          "Set up your next adventure! As the campaign creator, you will also serve as the Dungeon Master (DM)."
        }
        disableCursor
        width="600px"
        height="600px"
        footer="Note: Your new campaign may take a moment to appear in the Game Browser"
      >
        <form onSubmit={(e) => handleSubmit(e)} className="flex-column min-h-full justify-center">
          <Label htmlFor="campaignTitleInput" style={{ alignSelf: "flex-start" }} className="p-2">
            Title
          </Label>
          <Input
            id="campaignTitleInput"
            placeholder={"Enter an epic title for your campaign"}
            value={campaignTitle}
            onChange={(e) => setCampaignTitle(e.target.value)}
            maxLength={150}
          />
          <br />
          <Label
            htmlFor="campaignDescriptionInput"
            style={{ alignSelf: "flex-start" }}
            className="p-2"
          >
            Description
          </Label>
          <Textarea
            id="campaignDescriptionInput"
            placeholder="Describe what kind of adventure will be taking place"
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
            maxLength={1000}
            rows={20}
            style={{ height: "180px" }}
          />
          <Button asChild className="cursor-pointer mt-3">
            <input type="submit" value="Create Campaign" />
          </Button>
        </form>
      </GameCard>
    </div>
  )
}
