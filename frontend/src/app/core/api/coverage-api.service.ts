import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  FootballLeagueRegistryResponse,
  FootballLeagueToggleRequest,
  FootballLeagueToggleResponse
} from './api.types';

@Injectable({ providedIn: 'root' })
export class CoverageApiService {
  private readonly http = inject(HttpClient);

  getFootballLeagues(): Observable<FootballLeagueRegistryResponse> {
    return this.http.get<FootballLeagueRegistryResponse>('api/coverage/football/leagues');
  }

  updateFootballLeague(leagueId: number, request: FootballLeagueToggleRequest): Observable<FootballLeagueToggleResponse> {
    return this.http.patch<FootballLeagueToggleResponse>(`api/coverage/football/leagues/${leagueId}`, request);
  }
}
