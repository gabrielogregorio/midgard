export type projectsType = {
  bannedPaths: string[];
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
