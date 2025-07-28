import { Footer } from "@/components/shared/Footer";
import { Navigation } from "@/components/shared/Navigation";
import { createClient } from "@/utils/supabase/server";
import { convertStringToJson } from "@/lib/utils";
import { HomeHeader } from "./components/header";
import { CallToActions } from "./components/call-to-actions";
import { SocialLinks } from "./components/social-links";
import { AnimatedBackdrop } from "./components/animated-backdrop";

export const metadata = {
  title: "Home | Ryn",
}


export default async function Home() {
  const supabase = await createClient();

  const { data: allSettings } = await supabase
    .from("site_settings")
    .select("*")
    .in("category", ["home", "social-links"]);

  const homeHeader = {};
  const socialLinks = [];
  let ctaSetting = null;

  for (const row of allSettings ?? []) {
    if (row.category === "home") {
      homeHeader[row.key] = row.value;
      if (row.key === "call-to-actions") {
        ctaSetting = row;
      }
    } else if (row.category === "social-links") {
      socialLinks.push(row);
    }
  }

  socialLinks.sort((a, b) => a.id - b.id);
  const ctaButtons = convertStringToJson(ctaSetting?.value);

  return (
    <div className="">
      <Navigation />
      <AnimatedBackdrop />
      <div className="min-h-screen flex flex-col items-center ">
        <main className="flex-1 pt-16 h-full flex container max-w-full w-[480px]">
          <div className="container p-8 h-auto grid place-items-center w-full">
            <div className="text-center space-y-1 flex flex-col items-center w-full">
              <HomeHeader homeHeader={homeHeader} />
              <CallToActions ctaButtons={ctaButtons} />
              <SocialLinks socialLinks={socialLinks} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
