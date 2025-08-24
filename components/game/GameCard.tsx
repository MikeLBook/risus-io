import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CardProps {
  title: string
  description: string
  leftJustify?: boolean
  children: React.ReactNode
}

export default function GameCard({ title, description, leftJustify, children }: CardProps) {
  return (
    <Card
      style={{
        width: "400px",
        height: "200px",
        borderColor: "white",
        backgroundColor: "#333",
      }}
      className="bg-grey"
    >
      <CardHeader>
        <CardTitle style={{ color: "ivory", textAlign: leftJustify ? "start" : "center" }}>
          {title}
        </CardTitle>
        <CardDescription style={{ color: "ivory", textAlign: leftJustify ? "start" : "center" }}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent style={{ color: "ivory" }}>{children}</CardContent>
    </Card>
  )
}
