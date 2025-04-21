"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

interface UseDeleteNoteOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useDeleteNote(options?: UseDeleteNoteOptions) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id)

      if (error) {
        throw new Error(error.message)
      }

      return id
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
      queryClient.invalidateQueries({ queryKey: ["notes", id] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error as Error)
    },
  })
}
