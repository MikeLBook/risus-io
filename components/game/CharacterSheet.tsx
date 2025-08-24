import { Character } from "@/models/Character"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CharacterSheetProps {
  character: Character
  children: React.ReactNode
}

export default function CharacterSheet({ character, children }: CharacterSheetProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="grey-bg" style={{ minWidth: "50vw" }}>
          <DialogTitle>{character.name}</DialogTitle>
          <DialogDescription className="grey-bg">{character.description}</DialogDescription>
          <div></div>

          <DialogFooter>Created By: Juy</DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
