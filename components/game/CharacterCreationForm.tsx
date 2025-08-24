import { FormEvent, useState } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import * as z from "zod"
import { Character, Cliche } from "@/models/Character"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { v4 as uuidv4 } from "uuid"
import { useCharacters } from "@/contexts/charactersContext"
import Image from "next/image"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

const InjurySchema = z.object({
  description: z.string().trim(),
  penalty: z.int(),
})

const ClicheSchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .trim()
    .min(5, { error: "Cliche name must be at least 5 characters" })
    .max(50, { error: "Cliche name should not exceed 50 characters" }),
  dice: z.int().gte(1).lte(4),
  injuries: z.array(InjurySchema).length(0),
  isPrimary: z.boolean(),
})

const CharacterSchema = z
  .object({
    id: z.uuid({ error: "Character ID not found (application error)" }),
    userId: z.uuid({ error: "User ID not found (login error)" }),
    name: z.string().trim().min(5, { error: "Character name must be at least 5 characters" }),
    description: z.string().trim().min(10, { error: "Description must be at least 10 characters" }),
    cliches: z.array(ClicheSchema).min(1, { error: "Character must have at least 1 cliche" }),
    luckyShots: z
      .int()
      .multipleOf(3, { error: "Lucky Shots should be a multiple of 3 (application error)" }),
    hasHook: z.boolean(),
    hookText: z.string().trim(),
    hasTale: z.boolean(),
    taleText: z.string().trim(),
    tools: z.string().trim(),
    deceased: z.boolean(),
    archived: z.boolean(),
    createdAt: z.int().positive(),
    updatedAt: z.int().positive(),
  })
  .refine((data) => (data.hasHook ? data.hookText.length > 10 : true), {
    error: "Hook text must be at least 10 characters",
    path: ["hasHook", "hookText"],
  })
  .refine((data) => (data.hasTale ? data.taleText.length > 50 : true), {
    error: "Tale text must be at least 50 character",
    path: ["hasTale", "taleText"],
  })
  .refine(
    (data) => data.cliches.reduce((acc, cliche) => (cliche.isPrimary ? acc + 1 : acc), 0) === 1,
    {
      error: "Must have 1 primary cliche",
    }
  )
  .refine(
    (data) => {
      let diceRemaining = 10
      if (data.hasHook) diceRemaining += 1
      if (data.hasTale) diceRemaining += 1
      if (data.luckyShots > 0) {
        const usedDice = data.luckyShots / 3
        diceRemaining -= usedDice
      }
      const usedDice = data.cliches.reduce((acc, cliche) => acc + cliche.dice, 0)
      diceRemaining -= usedDice
      return diceRemaining === 0
    },
    { error: "Invalid Dice Allotment", path: ["cliches", "luckyShots"] }
  )

interface CharacterCreationProps {
  children: React.ReactNode
}
export default function CharacterCreationForm({ children }: CharacterCreationProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [cliches, setCliches] = useState<Cliche[]>([])
  const [luckyShots, setLuckyShots] = useState(0)
  const [hasHook, setHasHook] = useState(false)
  const [hookText, setHookText] = useState("")
  const [hasTale, setHasTale] = useState(false)
  const [taleText, setTaleText] = useState("")
  const [tools, setTools] = useState("")

  const { addCharacter } = useCharacters()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const time = Date.now()
      const newCharacter: Character = {
        id: uuidv4(),
        name,
        description,
        cliches,
        luckyShots,
        hasHook,
        hasTale,
        tools,
        hookText: hasHook ? hookText : "",
        taleText: hasTale ? taleText : "",
        userId: uuidv4(), // authenticated user id
        deceased: false,
        archived: false,
        createdAt: time,
        updatedAt: time,
      }

      const verifiedCharacter = CharacterSchema.parse(newCharacter)
      addCharacter(verifiedCharacter)
      resetCharacter()
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast(error.issues[0].message)
      } else {
        console.error(error)
      }
    }
  }

  const resetCharacter = () => {
    setName("")
    setDescription("")
    setCliches([])
    setLuckyShots(0)
    setHasHook(false)
    setHookText("")
    setHasTale(false)
    setTaleText("")
    setTools("")
  }

  const addCliche = (e: any) => {
    e.preventDefault()
    setCliches((prev) => {
      const clonedCliches = structuredClone(prev)
      clonedCliches.push({ id: uuidv4(), name: "", dice: 1, injuries: [], isPrimary: false })
      return clonedCliches
    })
  }

  const onClicheNameChange = (id: string, value: string) => {
    setCliches((prev) =>
      prev.map((cliche) => (cliche.id === id ? { ...cliche, name: value } : cliche))
    )
  }

  const onClicheDiceChange = (id: string, value: string) => {
    setCliches((prev) =>
      prev.map((cliche) => (cliche.id === id ? { ...cliche, dice: parseInt(value) } : cliche))
    )
  }

  const onClichePrimaryChange = (id: string, checked: boolean) => {
    setCliches((prev) =>
      prev.map((cliche) => (cliche.id === id ? { ...cliche, isPrimary: checked } : cliche))
    )
  }

  const onClicheDelete = (id: string, e: any) => {
    setCliches((prev) => {
      const clonedCliches = structuredClone(prev)
      const index = clonedCliches.findIndex((cliche) => cliche.id === id)
      clonedCliches.splice(index, 1)
      return clonedCliches
    })
  }

  const toggleCharacterHook = (e: any) => {
    e.preventDefault()
    setHasHook((prev) => !prev)
  }

  const toggleCharacterTale = (e: any) => {
    e.preventDefault()
    setHasTale((prev) => !prev)
  }

  let totalDice = 10
  if (hasHook) totalDice += 1
  if (hasTale) totalDice += 1
  const diceRemaining =
    totalDice -
    cliches.reduce((acc, cliche) => acc + cliche.dice, 0) -
    (luckyShots > 0 ? luckyShots / 3 : 0)

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
            <br />
            <br />
            You start with 10 dice to distribute across your chosen cliches. Dice may also be traded
            for lucky shots. Hooks and Tales give additional dice.
          </DialogDescription>
          <DialogHeader>
            <div style={{ marginLeft: "auto", fontSize: "large" }}>
              Dice Remaining: {diceRemaining}
            </div>
          </DialogHeader>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="flex-column-component gap-3">
              <Label htmlFor="newCharacterName">Name</Label>
              <Input
                id="newCharacterName"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Label htmlFor="newCharacterDescription">Description</Label>
              <Input
                id="newCharacterDescription"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Label htmlFor="newCharacterCliches">
                Cliches{" "}
                <Popover>
                  <PopoverTrigger>
                    <Image
                      src="/images/info.svg"
                      alt="Information Icon"
                      width="16"
                      height="16"
                      className="cursor-pointer"
                    ></Image>
                  </PopoverTrigger>
                  <PopoverContent>
                    {" "}
                    Your primary Cliché is the one that most clearly expresses how your character
                    sees himself. May be used by the GM as the default cliche in situations where
                    none of your character's cliches directly apply.
                  </PopoverContent>
                </Popover>
              </Label>
              {cliches.map((cliche, idx) => (
                <div key={cliche.id + idx} className="flex-component gap-3 ml-2">
                  <Label htmlFor={`cliche-${cliche.id}`}>Name</Label>
                  <Input
                    id={`cliche-${cliche.id}`}
                    value={cliche.name}
                    onChange={(e) => onClicheNameChange(cliche.id, e.target.value)}
                    placeholder="Name your cliche"
                  />
                  <Label htmlFor={`cliche-${cliche.id}-dice`}>Dice</Label>
                  <Input
                    id={`cliche-${cliche.id}-dice`}
                    type="number"
                    min="1"
                    max="4"
                    value={cliche.dice}
                    onChange={(e) => onClicheDiceChange(cliche.id, e.target.value)}
                  ></Input>
                  <div className="flex-component gap-2" style={{ width: "40%" }}>
                    <Label htmlFor={`cliche-${cliche.id}-primary`}>Set Primary</Label>
                    <Input
                      id={`cliche-${cliche.id}-primary`}
                      type="checkbox"
                      checked={cliche.isPrimary}
                      style={{ width: "24px" }}
                      onChange={(e) => onClichePrimaryChange(cliche.id, e.target.checked)}
                    ></Input>
                    <Image
                      src="/images/trash.svg"
                      alt="Trash Icon"
                      width="24"
                      height="24"
                      onClick={(e) => onClicheDelete(cliche.id, e)}
                    ></Image>
                  </div>
                </div>
              ))}
              {diceRemaining > 0 && (
                <Button onClick={(e) => addCliche(e)} style={{ maxWidth: "15ch" }}>
                  Add Cliche
                </Button>
              )}
              {hasHook && (
                <>
                  <Label htmlFor="newCharacterHook">
                    Add Hook{" "}
                    <Popover>
                      <PopoverTrigger>
                        <Image
                          src="/images/info.svg"
                          alt="Information Icon"
                          width="16"
                          height="16"
                          className="cursor-pointer"
                        ></Image>
                      </PopoverTrigger>
                      <PopoverContent>
                        {" "}
                        A Hook is some significant character flaw – a curse, an obsession, a
                        weakness, a sworn vow, a permanently crippling injury – that makes the
                        character’s life more interesting (which usually means less pleasant). A
                        character with a Hook gets an extra die to play with.
                      </PopoverContent>
                    </Popover>
                  </Label>
                  <Input
                    id="newCharacterHook"
                    value={hookText}
                    onChange={(e) => setHookText(e.target.value)}
                    placeholder="Summarize your hook"
                  ></Input>
                </>
              )}
              <Button onClick={(e) => toggleCharacterHook(e)} style={{ maxWidth: "15ch" }}>
                {hasHook ? "Remove Hook" : "Add Hook"}
              </Button>
              {hasTale && (
                <>
                  <Label htmlFor="newCharacterTale">
                    Add Tale{" "}
                    <Popover>
                      <PopoverTrigger>
                        <Image
                          src="/images/info.svg"
                          alt="Information Icon"
                          width="16"
                          height="16"
                          className="cursor-pointer"
                        ></Image>
                      </PopoverTrigger>
                      <PopoverContent>
                        {" "}
                        A Tale is a written “biography” of the character describing his life before
                        the events of the game. It should tell the reader where the character is
                        coming from, what he likes and dislikes, how he became who he is, what his
                        motives are. Some Tales are best written from the player’s omniscient
                        perspective; others are more fun if written as excerpts from the character’s
                        own diary. A character with a Tale gets an extra die to play with.
                      </PopoverContent>
                    </Popover>
                  </Label>
                  <Textarea
                    id="newCharacterTale"
                    value={taleText}
                    onChange={(e) => setTaleText(e.target.value)}
                    placeholder="Enter your character's tale"
                    style={{ width: "100%" }}
                  ></Textarea>
                </>
              )}
              <Button onClick={(e) => toggleCharacterTale(e)} style={{ maxWidth: "15ch" }}>
                {hasTale ? "Remove Tale" : "Add Tale"}
              </Button>
              <Label htmlFor="newCharacterLuckyShots">
                Lucky Shots{" "}
                <Popover>
                  <PopoverTrigger>
                    <Image
                      src="/images/info.svg"
                      alt="Information Icon"
                      width="16"
                      height="16"
                      className="cursor-pointer"
                    ></Image>
                  </PopoverTrigger>
                  <PopoverContent>
                    {" "}
                    This option allows players to spend some of their starting dice on something
                    other than Clichés. A single Cliché-die can, instead, buy three Lucky Shots
                    (spend two dice for six Lucky Shots, and so on). Using a Lucky Shot boosts any
                    Cliché roll by a single die, for a single die-roll. Lucky Shots “reset” between
                    game-sessions.
                  </PopoverContent>
                </Popover>
              </Label>
              <div className="flex-component gap-3">
                <Image
                  src="/images/circle-minus.svg"
                  alt="Decrement Lucky Shots"
                  width="24"
                  height="24"
                  className="cursor-pointer"
                  onClick={(e) => luckyShots > 0 && setLuckyShots((prev) => prev - 3)}
                ></Image>
                <span style={{ fontSize: "large" }}>{luckyShots}</span>
                <Image
                  src="/images/circle-plus.svg"
                  alt="Increment Lucky Shots"
                  width="24"
                  height="24"
                  className="cursor-pointer"
                  onClick={(e) => diceRemaining > 0 && setLuckyShots((prev) => prev + 3)}
                ></Image>
              </div>
              <Label htmlFor="newCharacterTools">
                Add Tools{" "}
                <Popover>
                  <PopoverTrigger>
                    <Image
                      src="/images/info.svg"
                      alt="Information Icon"
                      width="16"
                      height="16"
                      className="cursor-pointer"
                    ></Image>
                  </PopoverTrigger>
                  <PopoverContent>
                    {" "}
                    Tools of the Trade come “free” as part of each Cliché, but they’re vulnerable to
                    loss or damage, which can (sometimes) cripple or limit the power of the Cliché.
                    A Hirsute Barbarian, forced into a pit-fight without his trusty blade, can still
                    rely on his bare hands, but he’ll operate at half-dice until he’s once again
                    properly armed.
                  </PopoverContent>
                </Popover>
              </Label>
              <Input
                id="newCharacterTools"
                value={tools}
                onChange={(e) => setTools(e.target.value)}
                placeholder="Describe your kit"
              ></Input>
              <Button asChild>
                <input type="submit"></input>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
