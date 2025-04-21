import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NoteEditor } from "@/components/notes/note-editor";

export default async function NotePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  return <NoteEditor noteId={params.id} />;
}
