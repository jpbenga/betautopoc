import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class TicketApiService {
    constructor() {
        this.http = inject(HttpClient);
    }
    getTickets() {
        return this.http.get('api/tickets');
    }
    getTicket(ticketId) {
        return this.http.get(`api/tickets/${ticketId}`);
    }
    getAuditLog(ticketId) {
        return this.http.get(`api/tickets/${ticketId}/audit-log`);
    }
    generateTicket(request = {}) {
        return this.http.post('api/tickets/generate', request);
    }
    static { this.ɵfac = function TicketApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TicketApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: TicketApiService, factory: TicketApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TicketApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=ticket-api.service.js.map