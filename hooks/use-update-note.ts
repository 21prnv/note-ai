"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Note } from "@/types/note"

interface UpdateNoteInput {
  id: string
  title: string
  content: string
}

interface UseUpdateNoteOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useUpdateNote(options?: UseUpdateNoteOptions) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (input: UpdateNoteInput) => {
      const { data, error } = await supabase
        .from("notes")
        .update({
          title: input.title,
          content: input.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data as Note
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
      queryClient.invalidateQueries({ queryKey: ["notes", data.id] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error as Error)
    },
  })
}
