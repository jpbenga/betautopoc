import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CostAlertsResponse,
  CostBreakdownResponse,
  CostNoDataResponse,
  CostRunListResponse,
  CostSummary,
  CostTrendResponse
} from './api.types';

@Injectable({ providedIn: 'root' })
export class CostsApiService {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<CostSummary | CostNoDataResponse> {
    return this.http.get<CostSummary | CostNoDataResponse>('api/costs/summary');
  }

  getRuns(): Observable<CostRunListResponse | CostNoDataResponse> {
    return this.http.get<CostRunListResponse | CostNoDataResponse>('api/costs/runs');
  }

  getTrend(window = '7d'): Observable<CostTrendResponse | CostNoDataResponse> {
    const params = new HttpParams().set('window', window);
    return this.http.get<CostTrendResponse | CostNoDataResponse>('api/costs/trend', { params });
  }

  getBreakdown(): Observable<CostBreakdownResponse | CostNoDataResponse> {
    return this.http.get<CostBreakdownResponse | CostNoDataResponse>('api/costs/breakdown');
  }

  getAlerts(): Observable<CostAlertsResponse | CostNoDataResponse> {
    return this.http.get<CostAlertsResponse | CostNoDataResponse>('api/costs/alerts');
  }
}
