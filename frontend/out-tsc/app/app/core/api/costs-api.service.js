import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class CostsApiService {
    constructor() {
        this.http = inject(HttpClient);
    }
    getSummary() {
        return this.http.get('api/costs/summary');
    }
    getRuns() {
        return this.http.get('api/costs/runs');
    }
    getTrend(window = '7d') {
        const params = new HttpParams().set('window', window);
        return this.http.get('api/costs/trend', { params });
    }
    getBreakdown() {
        return this.http.get('api/costs/breakdown');
    }
    getAlerts() {
        return this.http.get('api/costs/alerts');
    }
    static { this.ɵfac = function CostsApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CostsApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: CostsApiService, factory: CostsApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CostsApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=costs-api.service.js.map