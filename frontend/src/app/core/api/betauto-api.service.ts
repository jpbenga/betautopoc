import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Analysis } from '../models/analysis.model';
import { Job } from '../models/job.model';
import { Selection } from '../models/selection.model';
import { Strategy } from '../models/strategy.model';

@Injectable({ providedIn: 'root' })
export class BetautoApiService {
  private readonly http = inject(HttpClient);

  runPipeline(): Observable<Job> {
    return this.http.post<Job>('pipeline/run', {});
  }

  getJob(jobId: string): Observable<Job> {
    return this.http.get<Job>(`jobs/${jobId}`);
  }

  getLatestSelection(): Observable<Selection> {
    return this.http.get<Selection>('selection/latest');
  }

  getLatestAnalysis(): Observable<Analysis> {
    return this.http.get<Analysis>('analysis/latest');
  }

  getStrategy(): Observable<Strategy> {
    return this.http.get<Strategy>('strategy');
  }

  updateStrategy(payload: Strategy): Observable<Strategy> {
    return this.http.put<Strategy>('strategy', payload);
  }
}
