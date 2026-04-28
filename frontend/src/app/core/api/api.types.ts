export interface ApiStatus {
  status: 'ok';
  version: string;
}

export interface ApiError {
  error: string;
  detail?: string | null;
  code?: string | null;
}

export type StepStatus = 'pending' | 'running' | 'done' | 'completed' | 'failed' | 'error' | 'skipped' | string;

export interface JobStep {
  label: string;
  status: StepStatus;
  message?: string | null;
  updated_at?: string | null;
}

export interface JobLogEntry {
  at?: string | null;
  message: string;
  level?: 'info' | 'success' | 'warning' | 'error' | null;
}

export interface RunRequest {
  date?: string | null;
  force?: boolean;
  strategy_file?: string | null;
  max_matches?: number | null;
  sleep_between_matches?: number | null;
  with_browser?: boolean | null;
}

export interface RunStartResponse {
  job_id: string;
  status: string;
}

export interface PickSummary {
  pick_id?: string | null;
  event?: string | null;
  market?: string | null;
  pick?: string | null;
  confidence_score?: number | null;
  risk_level?: string | null;
}

export interface SelectionSummary {
  picks: PickSummary[];
  estimated_combo_odds?: number | null;
  global_confidence_score?: number | null;
  combo_risk_level?: string | null;
}

export interface RunSummary {
  run_id?: string | null;
  run_dir?: string | null;
  target_date?: string | null;
  status?: string | null;
  files?: Record<string, unknown>;
}

export interface JobResponse {
  job_id: string;
  status: string;
  error?: string | null;
  created_at: string;
  completed_at?: string | null;
  target_date?: string | null;
  steps: Record<string, JobStep>;
  logs: JobLogEntry[];
  picks?: unknown;
  verification?: unknown;
  orchestrator_run_id?: string | null;
  orchestrator_run_dir?: string | null;
  run_summary?: RunSummary | Record<string, unknown> | null;
  selection_file?: string | null;
  selection?: unknown;
}

export type CapabilityImplementationStatus = 'available' | 'partial' | 'planned';

export interface CapabilityStatus {
  name: 'analysis' | 'match_data' | 'ticketing' | 'costs' | 'bankroll' | 'agents' | 'performance' | 'settings' | string;
  status: CapabilityImplementationStatus;
  endpoints: string[];
}

export interface CapabilitiesResponse {
  version: string;
  capabilities: CapabilityStatus[];
  available_endpoints: string[];
}

export interface AnalysisRunListItem {
  run_id: string;
  job_id: string;
  status: string;
  created_at: string;
  completed_at?: string | null;
  target_date?: string | null;
  progress: number;
  step_count: number;
  completed_steps: number;
  failed_steps: number;
  picks_count?: number | null;
  orchestrator_run_id?: string | null;
}

export interface AnalysisTimelineStep {
  id: string;
  title: string;
  status: string;
  message?: string | null;
  updated_at?: string | null;
}

export interface AnalysisLogEntry {
  at?: string | null;
  message: string;
  level: 'info' | 'success' | 'warning' | 'error' | string;
}

export interface AnalysisRun extends AnalysisRunListItem {
  error?: string | null;
  steps: AnalysisTimelineStep[];
  logs: AnalysisLogEntry[];
  run_summary?: Record<string, unknown> | null;
  selection?: unknown;
}

export interface MatchDataStatus {
  status: string;
  message?: string | null;
  target_date?: string | null;
}

export interface TeamSummary {
  id?: number | null;
  name: string;
}

export interface MarketOddsSummary {
  market_id?: number | null;
  name: string;
  values: Array<Record<string, string | number | null>>;
}

export interface OddsSummary {
  fixture_id: number;
  target_date: string;
  source_run_id: string;
  source_file: string;
  bookmaker_id?: number | null;
  bookmaker_name?: string | null;
  markets: MarketOddsSummary[];
  status: string;
}

export interface FixtureSummary {
  target_date: string;
  source_run_id: string;
  source_file: string;
  data_source_mode: string;
  date_consistency_status: string;
  league_id?: number | null;
  league_name?: string | null;
  fixture_id: number;
  home_team: TeamSummary;
  away_team: TeamSummary;
  kickoff?: string | null;
  status: string;
  odds_markets_count: number;
}

export interface MatchContextSummary {
  status: string;
  target_date: string;
  source_run_id: string;
  source_file: string;
  data_source_mode: string;
  date_consistency_status: string;
  league_id?: number | null;
  league_name?: string | null;
  matches_count: number;
  fixtures: FixtureSummary[];
}

export interface ProviderQuotaSummary {
  provider: string;
  status: string;
  message: string;
  used?: number | null;
  limit?: number | null;
  remaining?: number | null;
  source?: string | null;
}

export interface MatchDataNoDataResponse {
  status: 'no_data';
  message: string;
  target_date?: string | null;
  data_source_mode: string;
  date_consistency_status: 'no_data' | string;
}

export interface RebuildContextRequest {
  date: string;
  strategy_file?: string | null;
}

export interface RebuildContextResponse {
  status: string;
  message: string;
  target_date?: string | null;
}

export interface TicketPick {
  pick_id?: string | null;
  fixture_id?: number | null;
  event?: string | null;
  competition?: string | null;
  kickoff?: string | null;
  market?: string | null;
  market_canonical_id?: string | null;
  pick?: string | null;
  selection_canonical_id?: string | null;
  confidence_score?: number | null;
  expected_odds_min?: number | null;
  expected_odds_max?: number | null;
  risk_level?: string | null;
  reason?: string | null;
  evidence_summary?: Record<string, unknown>;
}

export interface TicketSummary {
  ticket_id: string;
  run_id: string;
  target_date?: string | null;
  status: string;
  generated_at?: string | null;
  estimated_combo_odds?: number | null;
  global_confidence_score?: number | null;
  combo_risk_level?: string | null;
  combo_in_target_range?: boolean | null;
  picks_count: number;
  notes_count: number;
  errors_count: number;
  source_run_dir: string;
  selection_file: string;
  data_source_mode: string;
  date_consistency_status?: string | null;
}

export interface TicketDetail extends TicketSummary {
  picks: TicketPick[];
  notes: string[];
  errors: string[];
  selection_config: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface TicketAuditEntry {
  level: 'info' | 'success' | 'warning' | 'error' | string;
  message: string;
  code?: string | null;
}

export interface TicketAuditLog {
  ticket_id: string;
  run_id: string;
  entries: TicketAuditEntry[];
  metadata: Record<string, unknown>;
}

export interface TicketGenerateRequest {
  date?: string | null;
  strategy_file?: string | null;
  max_matches?: number | null;
  sleep_between_matches?: number | null;
  with_browser?: boolean | null;
}

export interface TicketGenerateResponse {
  job_id: string;
  ticket_id?: string | null;
  status: string;
  target_date: string;
  message: string;
}
