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
}

export default function CardWrapper({ title, description, children, onClick }: CardProps) {
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
        cursor: onClick ? "pointer" : "auto",
      }}
      className="bg-grey"
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
