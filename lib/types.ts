export interface Program {
  id: string;
  agency: string;
  name: string;
  category: string;
  description: string;
  target_audience: string[];
  processing_time: string;
  official_url: string;
  steps: string[];
  requirements: string[];
  tags: string[];
}

export interface Hotline {
  agency: string;
  numbers: string[];
  purpose: string;
  emails: string[];
}

export type AgencyKind =
  | "dswd"
  | "sss"
  | "philhealth"
  | "pagibig"
  | "gsis"
  | "dole"
  | "doh"
  | "owwa"
  | "ched"
  | "tesda"
  | "other";
