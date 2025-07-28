export const adminNavData = {
  navMain: [
    {
      title: "Ryn Design",
      items: [
        {
          title: "Design Portfolio",
          url: "/admin/01-design-portfolio",
        },
        {
          title: "Gallery Showcase",
          url: "/admin/02-gallery-showcase",
        },
        {
          title: "Notes & Experiment",
          url: "/admin/03-notes-and-experiments",
        },
        {
          title: "Create New Project",
          url: "/admin/design-portfolio/new-design-project",
          hidden: true,
        },
        {
          title: "Edit Project",
          url: "/admin/design-portfolio/edit-design-project/*",
          hidden: true,
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Site Settings",
          url: "/admin/04-site-settings",
        }
      ],
    },
    // You can add more groups here in the future
  ],
};
