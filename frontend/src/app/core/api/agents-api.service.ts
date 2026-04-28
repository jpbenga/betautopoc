import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AgentDetail,
  AgentJobsResponse,
  AgentListResponse,
  AgentLogsResponse,
  AgentResourcesResponse,
  AgentsNoDataResponse,
  BrowserSessionsResponse
} from './api.types';

@Injectable({ providedIn: 'root' })
export class AgentsApiService {
  private readonly http = inject(HttpClient);

  getAgents(): Observable<AgentListResponse | AgentsNoDataResponse> {
    return this.http.get<AgentListResponse | AgentsNoDataResponse>('api/agents');
  }

  getAgent(agentId: string): Observable<AgentDetail> {
    return this.http.get<AgentDetail>(`api/agents/${agentId}`);
  }

  getJobs(): Observable<AgentJobsResponse | AgentsNoDataResponse> {
    return this.http.get<AgentJobsResponse | AgentsNoDataResponse>('api/agents/jobs');
  }

  getLogs(): Observable<AgentLogsResponse | AgentsNoDataResponse> {
    return this.http.get<AgentLogsResponse | AgentsNoDataResponse>('api/agents/logs');
  }

  getResources(): Observable<AgentResourcesResponse | AgentsNoDataResponse> {
    return this.http.get<AgentResourcesResponse | AgentsNoDataResponse>('api/agents/resources');
  }

  getBrowserSessions(): Observable<BrowserSessionsResponse> {
    return this.http.get<BrowserSessionsResponse>('api/agents/browser-use/sessions');
  }
}
