"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useNote } from "@/hooks/use-note"
import { NoteContent } from "@/components/notes/note-content"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2 } from "lucide-react"

interface NoteEditorProps {
  noteId: string
}

export function NoteEditor({ noteId }: NoteEditorProps) {
  const router = useRouter()
  const { data: note, isLoading, isError } = useNote(noteId)

  useEffect(() => {
    if (isError) {
      router.push("/notes")
    }
  }, [isError, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!note) {
    return null
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center border-b p-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/notes")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="ml-2 text-lg font-semibold">Back to Notes</h1>
      </div>
      <div className="flex-1">
        <NoteContent note={note} />
      </div>
    </div>
  )
}
