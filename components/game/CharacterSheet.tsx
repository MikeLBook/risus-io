import { Character } from "@/models/Character"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface CharacterSheetProps {
  character: Character
  children: React.ReactNode
}

export default function CharacterSheet({ character, children }: CharacterSheetProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="grey-bg max-h-screen overflow-auto" style={{ minWidth: "50vw" }}>
          <DialogTitle>{character.name}</DialogTitle>
          <DialogDescription className="grey-bg">{character.description}</DialogDescription>
          <div>
            <hr />
            <br />
            <Label style={{ fontSize: "16px" }}>Cliches</Label>
            {character.cliches.map((cliche, idx) => (
              <div key={cliche.id + idx} className="mb-2">
                {cliche.name}
                {` (${cliche.dice}) `}
                <div style={{ fontSize: "small" }}>{`${cliche.description}`}</div>
                {cliche.injuries.length > 0 &&
                  cliche.injuries.map((injury, idx) => {
                    return (
                      <div key={cliche.id + idx + "injury"} style={{ fontSize: "small" }}>
                        {injury.description}
                        {` (${injury.penalty})`}
                      </div>
                    )
                  })}
              </div>
            ))}
            <div className="mb-2 mt-4">Lucky Shots: {character.luckyShots}</div>
            <br />
            <hr />
            {character.hasHook && (
              <>
                <br />
                <Label style={{ fontSize: "16px" }}>Hook</Label>
                <p>{character.hookText}</p>
                <br />
                <hr />
              </>
            )}
            {character.hasTale && (
              <>
                <br />
                <Label style={{ fontSize: "16px" }}>Tale</Label>
                <p>{character.taleText}</p>
                <br />
                <hr />
              </>
            )}
            <br />
            <Label style={{ fontSize: "16px" }}>Tools</Label>
            <p>{character.tools}</p>
            <br />
            <hr />
          </div>
          <DialogFooter>
            <div>
              <p>
                Character Status:{" "}
                {character.deceased ? "Deceased" : character.campaignId ? "Questing" : "Alive"}
              </p>
              Created by {character.creatorName} on{" "}
              {new Date(character.createdAt).toLocaleDateString()}{" "}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
