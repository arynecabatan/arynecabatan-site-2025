import { Provider as ThemeProvider } from "@/components/shared/Provider";
import "./globals.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { createClient } from "@/utils/supabase/server";

import { IBM_Plex_Sans } from "next/font/google";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export async function generateMetadata() {
  const supabase = await createClient();
  const { data: settingsRows } = await supabase
    .from("site_settings")
    .select("*");
  const settings = settingsRows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
  return {
    metadataBase: new URL(settings.site_url),
    title: {
      template: `%s | ${settings.site_name}`,
      default: settings.site_name
    },
    description: settings.site_description,
    url: settings.site_url,
    alternates: {
      canonical: settings.canonical,
    },

    openGraph: {
      title: {
        template: `%s | ${settings.site_name || "Ryn Cabatan"}`,
        default: settings.site_name || "Ryn Cabatan",
      },
      description: settings.site_description,
      url: settings.site_url,
      siteName: settings.site_name,
      images: [
        {
          url: settings.site_image,
          width: 720,
          height: 480,
        },
      ],
      locale: "en-US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: {
        template: `%s | ${settings.site_name || "Ryn Cabatan"}`,
        default: settings.site_name || "Ryn Cabatan",
      },
      description: settings.site_description,
      site: settings.twitter_name,
      siteId: settings.twitter_id,
      creator: settings.twitter_name,
      creatorId: settings.twitter_id,
      images: {
        default: settings.site_image,
      },
    },

    icons: {
      icon: settings.logo,
      shortcut: settings.logo,
      apple: settings.logo,
      other: {
        rel: "apple-touch-icon-precomposed",
        url: settings.logo,
      },
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ibmPlexSans.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
