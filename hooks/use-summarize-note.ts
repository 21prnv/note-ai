"use client"

import { useMutation } from "@tanstack/react-query"

interface UseSummarizeNoteOptions {
  onSuccess?: (summary: string) => void
  onError?: (error: Error) => void
}

export function useSummarizeNote(options?: UseSummarizeNoteOptions) {
  return useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("Failed to summarize note")
      }

      const data = await response.json()
      return data.summary as string
    },
    onSuccess: (summary) => {
      options?.onSuccess?.(summary)
    },
    onError: (error) => {
      options?.onError?.(error as Error)
    },
  })
}
