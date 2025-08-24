import { FormEvent } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

interface CharacterCreationProps {
  children: React.ReactNode
}
export default function CharacterCreationForm({ children }: CharacterCreationProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submitting")
  }
  return (
    <>
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="grey-bg" style={{ minWidth: "50vw" }}>
          <DialogTitle>Character Creation</DialogTitle>
          <DialogDescription className="grey-bg">
            The character Cliché is the heart of Risus. Clichés are shorthand for a kind of person,
            implying their skills, background, social role and more. The “character classes” of the
            oldest RPGs are enduring Clichés: Wizard, Detective, Starpilot, Superspy. You can choose
            Clichés like those for your character, or devise something more outré, like Ghostly
            Pirate Cook, Fairy Godmother, Bruce Lee (for a character who does Bruce Lee stuff) or
            Giant Monster Who Just Wants To Be Loved For His Macrame.
          </DialogDescription>
          <form onSubmit={(e) => handleSubmit(e)}>
            <Button asChild>
              <input type="submit"></input>
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
