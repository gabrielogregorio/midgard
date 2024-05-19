export type projectsType = {
  bannedPaths: string[];
  filterFile: string;
  directory: string;
};

export type hierarchyType = {
  tags: string[];
  title: string;
};

export type configBase = {
  projects: projectsType[];
  hierarchy: hierarchyType[];
};
