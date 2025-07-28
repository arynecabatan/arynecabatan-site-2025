import { designData } from "../components/design-config";
import { createClient } from "@/utils/supabase/server";
import { PublicProjectList } from "../components/project-list";

export default async function AllProjectsPage() {
  const supabase = await createClient();

  const { data: rawProjects } = await supabase
    .from("projects")
    .select()
    .eq("isPublished", true)
    .order("created_at", { ascending: true });

  const projects =
    rawProjects.map((project) => {
      if (!project.cover_image) {
        return { ...project, publicUrl: "" };
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("projects").getPublicUrl(project.cover_image);

      return {
        ...project,
        publicUrl,
      };
    }) || [];

  return (
    <div className="container mx-auto px-4 lg:px-18 pb-4 flex flex-col gap-16 min-h-screen pt-16">
      <section className="py-4 flex flex-col items-center text-center flex-0">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Design portfolio
        </h1>
        <p className="mt-2 text-md text-muted-foreground">
          A collection of my recent design projects, case studies, and
          experiments.
        </p>
      </section>

      <main className="flex-1 flex flex-col gap-16">
        {projects && projects.length > 0 ? (
          <PublicProjectList projects={projects} />
        ) : (
          <div className="w-full grid place-items-center">
            <p className="text-center text-muted-foreground font-mono items-center ">
              No projects have been published yet. Come back soon!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}