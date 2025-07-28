import { createClient } from "@/utils/supabase/server";
import { NotesAndExperimentNavigation } from "./components/navigation";
import { NotesAndExperimentFooter } from "./components/footer";

export default async function NotesAndExperimentLayout({ children }) {
  return (
    <div className="flex flex-col">
      <NotesAndExperimentNavigation />
      <div className="flex flex-col">
        <div className="flex-1 flex justify-center">{children}</div>
        <NotesAndExperimentFooter />
      </div>
    </div>
  );
}
