"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Note } from "@/types/note"

export function useNotes() {
  const supabase = createClient()

  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("notes").select("*").order("updated_at", { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data as Note[]
    },
  })
}
