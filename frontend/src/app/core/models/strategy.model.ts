export interface StrategyRule {
  key: string;
  value: string | number | boolean;
}

export interface Strategy {
  id: string;
  version: string;
  name: string;
  updatedAt: string;
  rules: StrategyRule[];
}
