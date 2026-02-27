const normalize = (name = "") =>
  name.toLowerCase().trim().replace(/\s+/g, "-");

export const reorderProjects = (projects = [], filter = {}, PRIORITY_PROJECTS) => {
  if (!filter?.top_pick) return projects;

  const priorityList = PRIORITY_PROJECTS[filter.top_pick] || [];
  if (priorityList.length === 0) return projects;

  const priority = [];
  const others = [];

  projects.forEach((item) => {
    const slug = item.slug ? item.slug.toLowerCase().trim() : normalize(item.project_name);

    if (priorityList.some(p => p.trim() === slug.trim())) {
      priority.push(item);
    } else {
      others.push(item);
    }
  });
for (const item of projects) {
  const slug = item.slug || normalize(item.project_name);

  console.log("CHECKING:", slug);
  console.log("MATCH LIST:", priorityList);

  if (priorityList.some(p => p.trim() === slug.trim())) {
    console.log("PINNED:", slug);
    priority.push(item);
  } else {
    others.push(item);
  }
}
  return [...priority, ...others];
};