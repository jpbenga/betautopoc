import { JobLogEntry, StepStatus } from './api.types';

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
