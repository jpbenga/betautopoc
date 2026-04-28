import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  SettingsIntegrationsResponse,
  SettingsLogsResponse,
  SettingsResponse,
  SettingsValidationRequest,
  SettingsValidationResult
} from './api.types';

@Injectable({ providedIn: 'root' })
export class SettingsApiService {
  private readonly http = inject(HttpClient);

  getSettings(): Observable<SettingsResponse> {
    return this.http.get<SettingsResponse>('api/settings');
  }

  getIntegrations(): Observable<SettingsIntegrationsResponse> {
    return this.http.get<SettingsIntegrationsResponse>('api/settings/integrations');
  }

  validateSettings(request: SettingsValidationRequest): Observable<SettingsValidationResult> {
    return this.http.post<SettingsValidationResult>('api/settings/validate', request);
  }

  getLogs(): Observable<SettingsLogsResponse> {
    return this.http.get<SettingsLogsResponse>('api/settings/logs');
  }
}
