export interface SelectionItem {
  matchId: string;
  market: string;
  odd: number;
  confidence?: number;
}

export interface Selection {
  id: string;
  generatedAt: string;
  items: SelectionItem[];
}
