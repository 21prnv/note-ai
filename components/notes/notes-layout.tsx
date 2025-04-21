"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useNotes } from "@/hooks/use-notes"
import { NotesList } from "@/components/notes/notes-list"
import { NoteContent } from "@/components/notes/note-content"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Loader2, LogOut, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCreateNote } from "@/hooks/use-create-note"

export function NotesLayout() {
  const router = useRouter()
  const { signOut, user } = useAuth()
  const { toast } = useToast()
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

  const { data: notes, isLoading: isLoadingNotes } = useNotes()
  const { mutate: createNote, isPending: isCreatingNote } = useCreateNote({
    onSuccess: (newNote) => {
      setSelectedNoteId(newNote.id)
      toast({
        title: "Note created",
        description: "Your new note has been created",
      })
    },
  })

  const selectedNote = notes?.find((note) => note.id === selectedNoteId) || null

  const handleCreateNote = () => {
    if (!user) return

    createNote({
      title: "Untitled Note",
      content: "",
      user_id: user.id,
    })
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="flex w-full flex-col border-r md:w-80">
        <div className="flex items-center justify-between border-b p-4">
          <h1 className="text-xl font-semibold">Notes</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleCreateNote} disabled={isCreatingNote}>
              {isCreatingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isLoadingNotes ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <NotesList notes={notes || []} selectedNoteId={selectedNoteId} onSelectNote={setSelectedNoteId} />
        )}
      </div>
      <div className="flex-1">
        {selectedNote ? (
          <NoteContent note={selectedNote} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-semibold">No note selected</h2>
            <p className="mt-2 text-muted-foreground">Select a note from the sidebar or create a new one</p>
            <Button className="mt-4" onClick={handleCreateNote} disabled={isCreatingNote}>
              {isCreatingNote ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create a new note
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
