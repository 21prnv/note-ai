"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import type { Note } from "@/types/note"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface NotesListProps {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (id: string) => void
}

export function NotesList({ notes, selectedNoteId, onSelectNote }: NotesListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col">
      <div className="relative p-4">
        <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex-1 overflow-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No notes found</div>
        ) : (
          <div className="divide-y">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={cn(
                  "cursor-pointer p-4 transition-colors hover:bg-muted/50",
                  selectedNoteId === note.id && "bg-muted",
                )}
                onClick={() => onSelectNote(note.id)}
              >
                <h3 className="font-medium line-clamp-1">{note.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{note.content || "No content"}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
