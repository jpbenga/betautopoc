import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  TicketAuditLog,
  TicketDetail,
  TicketGenerateRequest,
  TicketGenerateResponse,
  TicketSummary
} from './api.types';

@Injectable({ providedIn: 'root' })
export class TicketApiService {
  private readonly http = inject(HttpClient);

  getTickets(): Observable<TicketSummary[]> {
    return this.http.get<TicketSummary[]>('api/tickets');
  }

  getTicket(ticketId: string): Observable<TicketDetail> {
    return this.http.get<TicketDetail>(`api/tickets/${ticketId}`);
  }

  getAuditLog(ticketId: string): Observable<TicketAuditLog> {
    return this.http.get<TicketAuditLog>(`api/tickets/${ticketId}/audit-log`);
  }

  generateTicket(request: TicketGenerateRequest = {}): Observable<TicketGenerateResponse> {
    return this.http.post<TicketGenerateResponse>('api/tickets/generate', request);
  }
}
