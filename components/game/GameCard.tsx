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
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export default function GameCard({ title, description, children, onClick, className }: CardProps) {
  const handleClick = () => {
    if (onClick) onClick()
  }

  return (
    <Card
      style={{
        width: "400px",
        height: "200px",
        borderColor: "white",
        backgroundColor: "#333",
      }}
      className={`bg-grey ${className ?? ""}`}
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle style={{ color: "ivory" }}>{title}</CardTitle>
        <CardDescription style={{ color: "ivory" }}>{description}</CardDescription>
      </CardHeader>
      <CardContent style={{ color: "ivory" }}>{children}</CardContent>
    </Card>
  )
}
