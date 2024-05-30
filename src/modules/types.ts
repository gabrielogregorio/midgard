export type hierarchyType = {
  tags: string[];
  title: string;
};

export type processHandlerType = {
  directory: string;
  bannedPaths: string[];
  tags: string[];
  title: string;
};

export type configBase = {
  projects: processHandlerType[];
};
