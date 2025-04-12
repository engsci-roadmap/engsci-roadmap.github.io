export interface CourseMetadata {
  code: string;
  title: string;
  roadmap: string;
  resources: string;
  problems: string;
}

export interface ExternalLink {
  title: string;
  url: string;
  icon?: string;
  description?: string;
}

export interface ResourceFile {
  title: string;
  file: string;
}

// This interface uses other interfaces as its properties
export interface CourseResources {
  courseCode: string;
  courseName: string;
  cheatsheet?: ResourceFile;
  processSheet?: ResourceFile;
  externalLinks?: ExternalLink[];
}
