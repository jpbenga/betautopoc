import { FixtureSummary, JobLogEntry, MatchDataNoDataResponse, StepStatus } from './api.types';

export type UiTone = 'default' | 'success' | 'warning' | 'danger' | 'live';

export function statusToTone(status: StepStatus | null | undefined): UiTone {
  const normalized = String(status || '').toLowerCase();

  if (['completed', 'done', 'success', 'succeeded'].includes(normalized)) {
    return 'success';
  }

  if (['failed', 'error'].includes(normalized)) {
    return 'danger';
  }

  if (['running', 'active'].includes(normalized)) {
    return 'live';
  }

  if (['pending', 'queued'].includes(normalized)) {
    return 'warning';
  }

  return 'default';
}

export function formatApiDate(value: string | null | undefined): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date);
}

export function normalizeLabel(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function logLevelToTone(entry: JobLogEntry): UiTone {
  if (entry.level === 'success') {
    return 'success';
  }

  if (entry.level === 'warning') {
    return 'warning';
  }

  if (entry.level === 'error') {
    return 'danger';
  }

  return statusToTone(entry.message);
}

export function fixtureLabel(fixture: Pick<FixtureSummary, 'home_team' | 'away_team'>): string {
  return `${fixture.home_team.name} vs ${fixture.away_team.name}`;
}

export function formatKickoff(value: string | null | undefined): string {
  return formatApiDate(value);
}

export function oddsStatusToTone(status: string | null | undefined): UiTone {
  const normalized = String(status || '').toLowerCase();

  if (normalized === 'available') {
    return 'success';
  }

  if (normalized === 'no_odds' || normalized === 'unavailable') {
    return 'warning';
  }

  if (normalized === 'failed' || normalized === 'error') {
    return 'danger';
  }

  return 'default';
}

export function isMatchDataNoDataResponse(value: unknown): value is MatchDataNoDataResponse {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'status' in value &&
      (value as { status?: unknown }).status === 'no_data'
  );
}
