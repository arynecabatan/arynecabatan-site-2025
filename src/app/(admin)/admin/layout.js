import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { DynamicBreadcrumb } from "./components/dynamic-breadcrumb";


// export async function generateMetadata() {
//   const supabase = await createClient();
//   const { data: settingsRows } = await supabase.from("site_settings").select("*");
//   const settings = settingsRows.reduce((acc, row) => {
//     acc[row.key] = row.value;
//     return acc;
//   }, {});
//   return {
//     title: 'Admin',
//     description: settings.site_description || 'A default description.',
//   };
// }

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const { data: userName, error } = await supabase.auth.getUser();

  if (error || !userName?.user) {
    redirect("/admin-login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <DynamicBreadcrumb />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
