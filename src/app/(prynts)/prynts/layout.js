import { redirect } from "next/navigation";
import { getSession } from "@/utils/iron-session/auth";
import { PryntsNavigation } from "./components/navigation";
import { PryntsFooter } from "./components/footer";

export default async function PryntsLayout({ children }) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect("/prynts-login");
  }

  return (
    <div className="flex flex-col">
      <PryntsNavigation />
      <div className="flex flex-col">
        <div className="flex-1 flex justify-center">{children}</div>
        <PryntsFooter />
      </div>
    </div>
  );
}