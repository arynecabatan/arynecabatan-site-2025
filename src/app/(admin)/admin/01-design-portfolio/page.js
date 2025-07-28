import { createClient } from "@/utils/supabase/server";
import { columns } from "../components/design-portfolio-data-table/project-columns";
import { ProjectDataTable } from "../components/design-portfolio-data-table/data-table";

export default async function DesignPortfolioPage() {
  const supabase = await createClient();

  const { data: rawProjects } = await supabase
    .from("projects")
    .select()
    .order("created_at", { ascending: false });

  const projects =
    rawProjects.map((project) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from("projects").getPublicUrl(project.cover_image);

      return {
        ...project,
        publicUrl,
      };
    }) || [];

  return (
    <div className="flex justify-center">
      <ProjectDataTable columns={columns} data={projects} />
    </div>
  );
}
