export interface AnalysisItem {
  matchId: string;
  summary: string;
  score?: number;
}

export interface Analysis {
  id: string;
  generatedAt: string;
  items: AnalysisItem[];
}
