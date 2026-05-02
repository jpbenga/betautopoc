import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class AnalysisApiService {
    constructor() {
        this.http = inject(HttpClient);
    }
    getRuns() {
        return this.http.get('api/analysis/runs');
    }
    getRun(runId) {
        return this.http.get(`api/analysis/runs/${runId}`);
    }
    getRunOutputs(runId) {
        return this.http.get(`api/analysis/runs/${runId}/outputs`);
    }
    stopRun(runId) {
        return this.http.post(`api/analysis/runs/${runId}/stop`, {});
    }
    getTimeline(runId) {
        return this.http.get(`api/analysis/runs/${runId}/timeline`);
    }
    getLogs(runId) {
        const options = runId ? { params: new HttpParams().set('run_id', runId) } : {};
        return this.http.get('api/analysis/logs', options);
    }
    static { this.ɵfac = function AnalysisApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AnalysisApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AnalysisApiService, factory: AnalysisApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AnalysisApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=analysis-api.service.js.map