import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApiStatus,
  CapabilitiesResponse,
  JobResponse,
  RunRequest,
  RunStartResponse
} from './api.types';

@Injectable({ providedIn: 'root' })
export class BetautoApiService {
  private readonly http = inject(HttpClient);

  health(): Observable<ApiStatus> {
    return this.http.get<ApiStatus>('health');
  }

  getCapabilities(): Observable<CapabilitiesResponse> {
    return this.http.get<CapabilitiesResponse>('api/capabilities');
  }

  runPipeline(request: RunRequest = {}): Observable<RunStartResponse> {
    return this.http.post<RunStartResponse>('api/run', request);
  }

  getJob(jobId: string): Observable<JobResponse> {
    return this.http.get<JobResponse>(`api/job/${jobId}`);
  }

  getJobFile(jobId: string, filename: string): Observable<Blob> {
    return this.http.get(`api/job/${jobId}/file/${filename}`, { responseType: 'blob' });
  }

  clearCache(): Observable<{ status: 'ok'; removed: number }> {
    return this.http.post<{ status: 'ok'; removed: number }>('api/cache/clear', {});
  }
}
