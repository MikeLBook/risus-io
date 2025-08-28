"use client"

interface CampaignProps {
  params: Promise<{ slug: string }>
}
export default async function Campaign({ params }: CampaignProps) {
  const { slug } = await params
  return <h1>Hello Campaign {slug}</h1>
}
