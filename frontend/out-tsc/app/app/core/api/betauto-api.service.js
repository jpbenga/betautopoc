import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class BetautoApiService {
    constructor() {
        this.http = inject(HttpClient);
    }
    health() {
        return this.http.get('health');
    }
    getCapabilities() {
        return this.http.get('api/capabilities');
    }
    runPipeline(request = {}) {
        return this.http.post('api/run', request);
    }
    getJob(jobId) {
        return this.http.get(`api/job/${jobId}`);
    }
    getJobFile(jobId, filename) {
        return this.http.get(`api/job/${jobId}/file/${filename}`, { responseType: 'blob' });
    }
    clearCache() {
        return this.http.post('api/cache/clear', {});
    }
    static { this.ɵfac = function BetautoApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BetautoApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: BetautoApiService, factory: BetautoApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BetautoApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=betauto-api.service.js.map