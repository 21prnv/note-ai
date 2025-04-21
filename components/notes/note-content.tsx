"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Note } from "@/types/note"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useUpdateNote } from "@/hooks/use-update-note"
import { useDeleteNote } from "@/hooks/use-delete-note"
import { useSummarizeNote } from "@/hooks/use-summarize-note"
import { Loader2, Save, Trash, Wand2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface NoteContentProps {
  note: Note
}

export function NoteContent({ note }: NoteContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [isEdited, setIsEdited] = useState(false)

  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote({
    onSuccess: () => {
      setIsEdited(false)
      toast({
        title: "Note updated",
        description: "Your note has been saved",
      })
    },
  })

  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote({
    onSuccess: () => {
      router.push("/notes")
      toast({
        title: "Note deleted",
        description: "Your note has been deleted",
      })
    },
  })

  const { mutate: summarizeNote, isPending: isSummarizing } = useSummarizeNote({
    onSuccess: (summary) => {
      setContent(summary)
      setIsEdited(true)
      toast({
        title: "Note summarized",
        description: "Your note has been summarized by AI",
      })
    },
  })

  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setIsEdited(false)
  }, [note])

  const handleSave = () => {
    updateNote({
      id: note.id,
      title,
      content,
    })
  }

  const handleDelete = () => {
    deleteNote(note.id)
  }

  const handleSummarize = () => {
    if (!content.trim()) {
      toast({
        title: "Cannot summarize",
        description: "Your note is empty",
        variant: "destructive",
      })
      return
    }

    summarizeNote(content)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setIsEdited(true)
          }}
          className="text-xl font-semibold border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSummarize} disabled={isSummarizing}>
            {isSummarizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Summarize
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} disabled={!isEdited || isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="text-destructive">
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Note</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this note? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          setIsEdited(true)
        }}
        placeholder="Start writing your note..."
        className="flex-1 resize-none rounded-none border-none p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  )
}
