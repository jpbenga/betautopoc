import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  FixtureSummary,
  MatchContextSummary,
  MatchDataNoDataResponse,
  OddsSummary,
  ProviderQuotaSummary,
  RebuildContextRequest,
  RebuildContextResponse
} from './api.types';

@Injectable({ providedIn: 'root' })
export class MatchDataApiService {
  private readonly http = inject(HttpClient);

  getContext(date: string): Observable<MatchContextSummary | MatchDataNoDataResponse> {
    const params = new HttpParams().set('date', date);
    return this.http.get<MatchContextSummary | MatchDataNoDataResponse>('api/match-data/context/latest', { params });
  }

  getFixtures(date: string, leagueId?: number): Observable<FixtureSummary[] | MatchDataNoDataResponse> {
    let params = new HttpParams().set('date', date);
    if (leagueId !== undefined) {
      params = params.set('league_id', String(leagueId));
    }
    return this.http.get<FixtureSummary[] | MatchDataNoDataResponse>('api/match-data/fixtures', { params });
  }

  getOdds(fixtureId: number, date?: string): Observable<OddsSummary | MatchDataNoDataResponse> {
    let params = new HttpParams().set('fixture_id', String(fixtureId));
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<OddsSummary | MatchDataNoDataResponse>('api/match-data/odds', { params });
  }

  getApiFootballQuota(): Observable<ProviderQuotaSummary> {
    return this.http.get<ProviderQuotaSummary>('api/match-data/providers/api-football/quota');
  }

  rebuildContext(request: RebuildContextRequest): Observable<RebuildContextResponse> {
    return this.http.post<RebuildContextResponse>('api/match-data/context/rebuild', request);
  }
}
