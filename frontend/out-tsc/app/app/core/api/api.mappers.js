export function statusToTone(status) {
    const normalized = String(status || '').toLowerCase();
    if (['completed', 'done', 'success', 'succeeded'].includes(normalized)) {
        return 'success';
    }
    if (['failed', 'error'].includes(normalized)) {
        return 'danger';
    }
    if (['running', 'active', 'generating'].includes(normalized)) {
        return 'live';
    }
    if ([
        'pending',
        'queued',
        'starting',
        'partial',
        'proxy',
        'estimated',
        'timeout',
        'stopped',
        'cancelled',
        'interrupted',
        'completed_with_errors',
        'completed_with_warnings',
        'completed_filter_only'
    ].includes(normalized)) {
        return 'warning';
    }
    return 'default';
}
export function formatApiDate(value) {
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
export function normalizeLabel(value) {
    return value
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
export function logLevelToTone(entry) {
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
export function fixtureLabel(fixture) {
    return `${fixture.home_team.name} vs ${fixture.away_team.name}`;
}
export function formatKickoff(value) {
    return formatApiDate(value);
}
export function oddsStatusToTone(status) {
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
export function confidenceScoreToTone(value) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 70) {
        return value && value > 0 ? 'danger' : 'default';
    }
    if (value >= 95) {
        return 'score-95-plus';
    }
    if (value >= 90) {
        return 'score-90';
    }
    if (value >= 85) {
        return 'score-85';
    }
    if (value >= 80) {
        return 'score-80';
    }
    if (value >= 75) {
        return 'score-75';
    }
    return 'score-70';
}
export function isMatchDataNoDataResponse(value) {
    return Boolean(value &&
        typeof value === 'object' &&
        'status' in value &&
        value.status === 'no_data');
}
//# sourceMappingURL=api.mappers.js.map