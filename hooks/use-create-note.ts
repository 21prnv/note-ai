"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Note } from "@/types/note"

interface CreateNoteInput {
  title: string
  content: string
  user_id: string
}

interface UseCreateNoteOptions {
  onSuccess?: (note: Note) => void
  onError?: (error: Error) => void
}

export function useCreateNote(options?: UseCreateNoteOptions) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (input: CreateNoteInput) => {
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            title: input.title,
            content: input.content,
            user_id: input.user_id,
          },
        ])
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data as Note
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      options?.onError?.(error as Error)
    },
  })
}
