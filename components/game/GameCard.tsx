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
  footer?: React.ReactNode
  leftJustify?: boolean
  children: React.ReactNode
}

export default function GameCard({ title, description, footer, leftJustify, children }: CardProps) {
  return (
    <Card
      style={{
        width: "400px",
        height: "250px",
        borderColor: "white",
        backgroundColor: "#333",
        paddingBottom: "0",
      }}
      className="bg-grey cursor-pointer"
    >
      <CardHeader>
        <CardTitle
          style={{ color: "ivory", textAlign: leftJustify ? "start" : "center", height: "15%" }}
        >
          {title}
        </CardTitle>
        <CardDescription
          style={{ color: "ivory", textAlign: leftJustify ? "start" : "center", height: "15%" }}
        >
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent style={{ color: "ivory", height: "55%" }}>{children}</CardContent>
      {footer && <CardFooter style={{ color: "ivory", height: "15%" }}>{footer}</CardFooter>}
    </Card>
  )
}
