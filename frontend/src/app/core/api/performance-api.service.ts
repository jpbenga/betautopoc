import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  MarketsPerformanceResponse,
  PerformanceAccuracyResponse,
  PerformanceCalibrationResponse,
  PerformanceDataQualityResponse,
  PerformanceDriftResponse,
  PerformanceLogsResponse,
  PerformanceNoDataResponse,
  PerformanceRoiResponse,
  PerformanceSummaryResponse,
  StrategiesCompareResponse
} from './api.types';

@Injectable({ providedIn: 'root' })
export class PerformanceApiService {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<PerformanceSummaryResponse | PerformanceNoDataResponse> {
    return this.http.get<PerformanceSummaryResponse | PerformanceNoDataResponse>('api/performance/summary');
  }

  getAccuracy(): Observable<PerformanceAccuracyResponse | PerformanceNoDataResponse> {
    return this.http.get<PerformanceAccuracyResponse | PerformanceNoDataResponse>('api/performance/accuracy');
  }

  getRoi(): Observable<PerformanceRoiResponse | PerformanceNoDataResponse> {
    return this.http.get<PerformanceRoiResponse | PerformanceNoDataResponse>('api/performance/roi');
  }

  getCalibration(): Observable<PerformanceCalibrationResponse | PerformanceNoDataResponse> {
    return this.http.get<PerformanceCalibrationResponse | PerformanceNoDataResponse>('api/performance/calibration');
  }

  getStrategiesCompare(): Observable<StrategiesCompareResponse | PerformanceNoDataResponse> {
    return this.http.get<StrategiesCompareResponse | PerformanceNoDataResponse>('api/performance/strategies/compare');
  }

  getMarkets(): Observable<MarketsPerformanceResponse | PerformanceNoDataResponse> {
    return this.http.get<MarketsPerformanceResponse | PerformanceNoDataResponse>('api/performance/markets');
  }

  getDrift(): Observable<PerformanceDriftResponse | PerformanceNoDataResponse> {
    return this.http.get<PerformanceDriftResponse | PerformanceNoDataResponse>('api/performance/drift');
  }

  getDataQuality(): Observable<PerformanceDataQualityResponse | PerformanceNoDataResponse> {
    return this.http.get<PerformanceDataQualityResponse | PerformanceNoDataResponse>('api/performance/data-quality');
  }

  getLogs(): Observable<PerformanceLogsResponse | PerformanceNoDataResponse> {
    return this.http.get<PerformanceLogsResponse | PerformanceNoDataResponse>('api/performance/logs');
  }
}
