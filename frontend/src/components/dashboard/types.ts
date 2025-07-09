export interface Tender {
  id: number;
  title: string;
  organization: string;
  value: string;
  deadline: string;
  location: string;
  relevanceScore: number;
  type: string;
  status: string;
}

export interface Activity {
  id: number;
  action: string;
  title: string;
  time: string;
}
