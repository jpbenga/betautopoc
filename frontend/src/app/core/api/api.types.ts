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

export interface CostNoDataResponse {
  status: 'no_data';
  message: string;
  data_source_mode: string;
}

export interface CostRunItem {
  run_id: string;
  target_date?: string | null;
  status?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
  duration_seconds?: number | null;
  duration_label: string;
  matches_analyzed_estimate: number;
  estimated_tokens: number;
  estimated_cost: number;
  openai_estimated_cost: number;
  api_football_estimated_cost: number;
  browser_use_estimated_cost: number;
  source_file: string;
  data_source_mode: string;
}

export interface CostSummary {
  status: string;
  currency: string;
  total_cost_today: number;
  total_cost_7d: number;
  runs_count: number;
  average_cost_per_run: number;
  total_estimated_tokens: number;
  estimation_method: string;
}

export interface CostRunListResponse {
  status: string;
  runs: CostRunItem[];
}

export interface CostTrendPoint {
  date: string;
  cost: number;
}

export interface CostTrendResponse {
  status: string;
  window: string;
  points: CostTrendPoint[];
}

export interface CostBreakdownItem {
  service: string;
  estimated_requests: number;
  estimated_cost: number;
  average_cost_per_request: number;
  status: string;
}

export interface CostBreakdownResponse {
  status: string;
  services: CostBreakdownItem[];
}

export interface CostAlert {
  level: 'info' | 'success' | 'warning' | 'error' | string;
  title: string;
  detail: string;
  metric: string;
  threshold: number;
  value: number;
}

export interface CostAlertsResponse {
  status: string;
  alerts: CostAlert[];
}

export interface BankrollNoDataResponse {
  status: 'no_data';
  message: string;
  data_source_mode: string;
}

export interface BankrollSummary {
  status: string;
  currency: string;
  total_bankroll: number;
  available_capital: number;
  total_exposure: number;
  exposure_percent: number;
  estimated_roi: number;
  simulated_pnl: number;
  open_positions_count: number;
  stake_per_ticket: number;
  simulation_mode: string;
}

export interface BankrollTrendPoint {
  date: string;
  bankroll: number;
  exposure: number;
  available_capital: number;
}

export interface BankrollTrendResponse {
  status: string;
  window: string;
  points: BankrollTrendPoint[];
}

export interface BankrollExposureItem {
  ticket_id: string;
  run_id: string;
  target_date?: string | null;
  exposure: number;
  bankroll_percent: number;
  estimated_odds?: number | null;
  potential_return: number;
  risk_level?: string | null;
  picks_count: number;
  source_file: string;
  data_source_mode: string;
}

export interface BankrollExposureResponse {
  status: string;
  total_exposure: number;
  exposure_percent: number;
  items: BankrollExposureItem[];
}

export interface OpenPosition {
  position_id: string;
  ticket_id: string;
  run_id: string;
  target_date?: string | null;
  stake: number;
  estimated_odds?: number | null;
  potential_return: number;
  status: string;
  result_status: string;
  risk_level?: string | null;
  picks_count: number;
  source_file: string;
}

export interface OpenPositionsResponse {
  status: string;
  positions: OpenPosition[];
}

export interface RiskLimit {
  key: string;
  value: number | string;
  unit: string;
  status: string;
}

export interface RiskLimitsResponse {
  status: string;
  limits: RiskLimit[];
}

export interface BankrollAlert {
  level: 'info' | 'success' | 'warning' | 'danger' | string;
  title: string;
  detail: string;
  metric: string;
  threshold: number;
  value: number;
}

export interface BankrollAlertsResponse {
  status: string;
  alerts: BankrollAlert[];
}

export interface AgentsNoDataResponse {
  status: 'no_data';
  message: string;
  data_source_mode: string;
}

export interface AgentSummary {
  agent_id: string;
  label: string;
  status: string;
  current_job_id?: string | null;
  last_activity_at?: string | null;
  last_message?: string | null;
  jobs_processed_count: number;
  error_count: number;
  source_mode: string;
}

export interface AgentJob {
  job_id: string;
  run_id?: string | null;
  agent_id: string;
  target_date?: string | null;
  status: string;
  started_at?: string | null;
  finished_at?: string | null;
  current_step?: string | null;
  last_message?: string | null;
  source_mode: string;
}

export interface AgentDetail extends AgentSummary {
  jobs: AgentJob[];
}

export interface AgentListResponse {
  status: string;
  agents: AgentSummary[];
}

export interface AgentJobsResponse {
  status: string;
  jobs: AgentJob[];
}

export interface AgentLogEntry {
  at?: string | null;
  agent_id: string;
  job_id?: string | null;
  level: 'info' | 'success' | 'warning' | 'error' | string;
  message: string;
  source_mode: string;
}

export interface AgentLogsResponse {
  status: string;
  logs: AgentLogEntry[];
}

export interface AgentResourcesResponse {
  status: string;
  cpu_usage: number;
  memory_usage: number;
  jobs_running: number;
  active_sessions: number;
  source_mode: string;
  message: string;
}

export interface BrowserSession {
  session_id: string;
  status: string;
  reason: string;
  source_mode: string;
}

export interface BrowserSessionsResponse {
  status: string;
  reason: string;
  sessions: BrowserSession[];
}

export interface StrategySettings {
  strategy_file: string;
  strategy_id?: string | null;
  enabled?: boolean | null;
  max_matches?: number | null;
  sleep_between_matches?: number | null;
  min_confidence?: number | null;
  allowed_markets: string[];
  require_odds_available?: boolean | null;
  data_provider?: string | null;
  season?: number | null;
  read_only: boolean;
}

export interface RuntimeSettings {
  orchestrator_enabled: boolean;
  with_browser: boolean;
  strict_mode: boolean;
  allow_legacy: boolean;
  cors_origins: string[];
  read_only: boolean;
}

export interface SelectionSettings {
  combo_min_odds?: number | null;
  combo_max_odds?: number | null;
  max_picks?: number | null;
  min_pick_confidence?: number | null;
  min_global_match_confidence?: number | null;
  min_combo_confidence?: number | null;
  read_only: boolean;
}

export interface RiskSettingsApi {
  max_pick_risk?: string | null;
  max_combo_risk?: string | null;
  bankroll_enabled?: boolean | null;
  staking_method?: string | null;
  max_stake_percent_per_ticket?: number | null;
  daily_loss_limit_percent?: number | null;
  weekly_loss_limit_percent?: number | null;
  read_only: boolean;
}

export interface SettingsIntegrationStatus {
  name: string;
  status: string;
  detail: string;
  source: string;
  read_only: boolean;
}

export interface NotificationSettingsApi {
  status: string;
  email_alerts?: boolean | null;
  critical_alerts_only?: boolean | null;
  slack_webhook_configured?: boolean | null;
  read_only: boolean;
}

export interface SettingsMetadata {
  status: string;
  mode: string;
  writable: boolean;
  message: string;
}

export interface SettingsResponse {
  status: string;
  strategy: StrategySettings;
  runtime: RuntimeSettings;
  selection: SelectionSettings;
  risk: RiskSettingsApi;
  integrations: SettingsIntegrationStatus[];
  notifications: NotificationSettingsApi;
  metadata: SettingsMetadata;
}

export interface SettingsIntegrationsResponse {
  status: string;
  integrations: SettingsIntegrationStatus[];
}

export interface SettingsValidationRequest {
  settings: Record<string, unknown>;
}

export interface SettingsValidationResult {
  status: string;
  errors: string[];
  warnings: string[];
  normalized: Record<string, unknown>;
  writable: boolean;
  message: string;
}

export interface SettingsLogEntry {
  at?: string | null;
  level: 'info' | 'success' | 'warning' | 'error' | string;
  message: string;
  source: string;
}

export interface SettingsLogsResponse {
  status: string;
  logs: SettingsLogEntry[];
}
