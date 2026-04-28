import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  BankrollAlertsResponse,
  BankrollExposureResponse,
  BankrollNoDataResponse,
  BankrollSummary,
  BankrollTrendResponse,
  OpenPositionsResponse,
  RiskLimitsResponse
} from './api.types';

@Injectable({ providedIn: 'root' })
export class BankrollApiService {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<BankrollSummary | BankrollNoDataResponse> {
    return this.http.get<BankrollSummary | BankrollNoDataResponse>('api/bankroll/summary');
  }

  getTrend(window = '7d'): Observable<BankrollTrendResponse | BankrollNoDataResponse> {
    const params = new HttpParams().set('window', window);
    return this.http.get<BankrollTrendResponse | BankrollNoDataResponse>('api/bankroll/trend', { params });
  }

  getExposure(): Observable<BankrollExposureResponse | BankrollNoDataResponse> {
    return this.http.get<BankrollExposureResponse | BankrollNoDataResponse>('api/bankroll/exposure');
  }

  getOpenPositions(): Observable<OpenPositionsResponse | BankrollNoDataResponse> {
    return this.http.get<OpenPositionsResponse | BankrollNoDataResponse>('api/bankroll/positions/open');
  }

  getRiskLimits(): Observable<RiskLimitsResponse> {
    return this.http.get<RiskLimitsResponse>('api/bankroll/risk-limits');
  }

  getAlerts(): Observable<BankrollAlertsResponse | BankrollNoDataResponse> {
    return this.http.get<BankrollAlertsResponse | BankrollNoDataResponse>('api/bankroll/alerts');
  }
}
