import { redirect } from "next/navigation";
import { guestLogout } from "../action";
import { getSession } from "@/utils/iron-session/auth";
import { DesignNavigation } from "./components/navigation";
import { DesignFooter } from "./components/footer";
import { createClient } from "@/utils/supabase/server";

export default async function DesignLayout({ children }) {
  // const session = await getSession();
  const supabase = await createClient();

  // if (!session.isAuthenticated) {
  //   redirect("/design-login");
  // }

  const { data: resumeSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "resume")
    .single();

  const resumePath = resumeSetting?.value;

  return (
    <div className="flex flex-col">
      <DesignNavigation resumePath={resumePath} />
      {/* <form action={guestLogout}>
        <button className="text-button-sm">Logout</button>
      </form> */}
      <div className="flex flex-col">
        <div className="flex-1 flex justify-center">{children}</div>
        <DesignFooter />
      </div>
    </div>
  );
}
