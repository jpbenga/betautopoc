import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class AgentsApiService {
    constructor() {
        this.http = inject(HttpClient);
    }
    getAgents() {
        return this.http.get('api/agents');
    }
    getAgent(agentId) {
        return this.http.get(`api/agents/${agentId}`);
    }
    getJobs() {
        return this.http.get('api/agents/jobs');
    }
    getLogs() {
        return this.http.get('api/agents/logs');
    }
    getResources() {
        return this.http.get('api/agents/resources');
    }
    getBrowserSessions() {
        return this.http.get('api/agents/browser-use/sessions');
    }
    static { this.ɵfac = function AgentsApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AgentsApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AgentsApiService, factory: AgentsApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AgentsApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=agents-api.service.js.map