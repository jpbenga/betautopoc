import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AnalysisLogEntry,
  AnalysisRun,
  AnalysisRunListItem,
  AnalysisTimelineStep
} from './api.types';

@Injectable({ providedIn: 'root' })
export class AnalysisApiService {
  private readonly http = inject(HttpClient);

  getRuns(): Observable<AnalysisRunListItem[]> {
    return this.http.get<AnalysisRunListItem[]>('api/analysis/runs');
  }

  getRun(runId: string): Observable<AnalysisRun> {
    return this.http.get<AnalysisRun>(`api/analysis/runs/${runId}`);
  }

  getTimeline(runId: string): Observable<AnalysisTimelineStep[]> {
    return this.http.get<AnalysisTimelineStep[]>(`api/analysis/runs/${runId}/timeline`);
  }

  getLogs(runId?: string): Observable<AnalysisLogEntry[]> {
    const options = runId ? { params: new HttpParams().set('run_id', runId) } : {};
    return this.http.get<AnalysisLogEntry[]>('api/analysis/logs', options);
  }
}
