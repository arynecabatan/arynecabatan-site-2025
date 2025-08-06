import { redirect } from "next/navigation";
import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";
import { getSession } from "@/utils/iron-session/auth";

export default async function PryntsLogin({ children }) {
  const session = await getSession();

  if (session.isAuthenticated) {
    redirect("/prynts");
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