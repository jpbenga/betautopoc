import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  StrategyActivateRequest,
  StrategyActivateResponse,
  StrategyApplyRequest,
  StrategyApplyResponse,
  StrategyCatalogResponse,
  StrategyDetailResponse,
  StrategySaveRequest,
  StrategySaveResponse
} from './api.types';

@Injectable({ providedIn: 'root' })
export class StrategyApiService {
  private readonly http = inject(HttpClient);

  getCatalog(): Observable<StrategyCatalogResponse> {
    return this.http.get<StrategyCatalogResponse>('api/strategy');
  }

  getDetail(strategyFile?: string): Observable<StrategyDetailResponse> {
    const params = strategyFile ? new HttpParams().set('strategy_file', strategyFile) : undefined;
    return this.http.get<StrategyDetailResponse>('api/strategy/detail', { params });
  }

  activate(request: StrategyActivateRequest): Observable<StrategyActivateResponse> {
    return this.http.put<StrategyActivateResponse>('api/strategy/active', request);
  }

  save(request: StrategySaveRequest): Observable<StrategySaveResponse> {
    return this.http.put<StrategySaveResponse>('api/strategy/config', request);
  }

  applyToRun(request: StrategyApplyRequest): Observable<StrategyApplyResponse> {
    return this.http.post<StrategyApplyResponse>('api/strategy/apply-to-run', request);
  }
}
