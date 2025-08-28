"use client"

import { useAuth } from "@/hooks/useAuth"
import { Campaign } from "@/models/Campaign"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface ICampaignContext {
  campaigns: Campaign[]
  addCampaign: (campaign: Campaign) => Promise<void>
  refreshCampaigns: () => Promise<void>
}

const CampaignContext = createContext<ICampaignContext>({
  campaigns: [],
  addCampaign: async () => {},
  refreshCampaigns: async () => {},
})

interface CampaignProviderProps {
  children: React.ReactNode
}

export function CampaignProvider({ children }: CampaignProviderProps) {
  const supabase = createClient()
  const { user } = useAuth()

  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  useEffect(() => {
    console.log(campaigns)
  }, [campaigns])

  useEffect(() => {
    if (!user) {
      setCampaigns([])
      return
    }

    refreshCampaigns()

    const channel = supabase
      .channel("campaigns-subscription")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "campaigns" },
        (payload) => {
          refreshCampaigns()
        }
      )

    channel.subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user, supabase])

  const refreshCampaigns = async () => {
    if (!user) {
      setCampaigns([])
      return
    }

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("dm_id", user.id)
      .order("updated_date", { ascending: false })

    if (error) {
      console.error("Error fetching campaigns:", error)
      return
    }

    const mappedCampaigns: Campaign[] = (data || []).map((row) => ({
      id: row.id,
      dmId: row.dm_id,
      dmName: row.dm_name,
      title: row.title,
      description: row.description,
      createdDate: row.created_date,
      updatedDate: row.updated_date,
      gameMode: row.game_mode,
      gameData: row.game_data,
      luckyShots: row.lucky_shots,
    }))

    setCampaigns(mappedCampaigns)
  }

  const addCampaign = async (campaign: Campaign) => {
    if (!user) return

    const { error } = await supabase.from("campaigns").insert([
      {
        id: campaign.id,
        dm_id: campaign.dmId,
        dm_name: campaign.dmName,
        title: campaign.title,
        description: campaign.description,
        created_date: campaign.createdDate,
        updated_date: campaign.updatedDate,
        game_mode: campaign.gameMode,
        game_data: campaign.gameData,
        lucky_shots: campaign.luckyShots,
      },
    ])

    if (error) {
      console.error("Error creating campaign: ", error)
    }
  }

  const value = {
    campaigns,
    refreshCampaigns,
    addCampaign,
  }

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>
}

export const useCampaigns = () => useContext(CampaignContext)

export default CampaignContext
