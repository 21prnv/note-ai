import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NotesLayout } from "@/components/notes/notes-layout";

export default async function NotesPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  return <NotesLayout />;
}
