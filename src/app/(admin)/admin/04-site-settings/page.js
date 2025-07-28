import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSiteSettings } from "@/app/(admin)/action";
import { NewSettingDialog } from "./components/new-setting-dialog";
import { SettingsDataTable } from "./components/site-settings-data-table";
import { columns } from "./components/site-settings-column";

export default async function SiteSettingsPage() {
  const supabase = await createClient();

  const { data: settings_seo } = await supabase
    .from("site_settings")
    .select("*")
    .eq("category", "seo");

  const { data: settings_portfolio } = await supabase
    .from("site_settings")
    .select("*")
    .eq("category", "portfolio");

  const { data: settings_blog } = await supabase
    .from("site_settings")
    .select("*")
    .eq("category", "blog");

  const { data: settings_social } = await supabase
    .from("site_settings")
    .select("*")
    .eq("category", "social-links");

  const { data: settings_other } = await supabase
    .from("site_settings")
    .select("*")
    .eq("category", "other");

    const { data: settings_home } = await supabase
    .from("site_settings")
    .select("*")
    .eq("category", "home");

  return (
    <main className="flex flex-col gap-6">
      <NewSettingDialog />
      <div className="flex gap-12 flex-wrap">
        <div className="flex flex-col gap-8">

          <SettingsDataTable
            columns={columns}
            data={settings_home}
            header="Home"
          />

          <SettingsDataTable
            columns={columns}
            data={settings_portfolio}
            header="Portfolio"
          />

          <SettingsDataTable
            columns={columns}
            data={settings_blog}
            header="Blog"
          />

          <SettingsDataTable
            columns={columns}
            data={settings_social}
            header="Social links"
          />
        </div>

        <div className="flex flex-col gap-8">
          <SettingsDataTable
            columns={columns}
            data={settings_seo}
            header="SEO"
          />

          <SettingsDataTable
            columns={columns}
            data={settings_other}
            header="Other"
          />
        </div>
      </div>
    </main>
  );
}
