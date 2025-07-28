import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";

export default async function AdminLogin({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    return redirect("/admin");
  }

  return (
    <div>
      <Navigation />
      <div className="flex flex-col justify-center items-center min-h-screen w-full ">
        {children}
        <Footer />
      </div>
    </div>
  );
}
