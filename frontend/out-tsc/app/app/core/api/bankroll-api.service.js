import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class BankrollApiService {
    constructor() {
        this.http = inject(HttpClient);
    }
    getSummary() {
        return this.http.get('api/bankroll/summary');
    }
    getTrend(window = '7d') {
        const params = new HttpParams().set('window', window);
        return this.http.get('api/bankroll/trend', { params });
    }
    getExposure() {
        return this.http.get('api/bankroll/exposure');
    }
    getOpenPositions() {
        return this.http.get('api/bankroll/positions/open');
    }
    getRiskLimits() {
        return this.http.get('api/bankroll/risk-limits');
    }
    getAlerts() {
        return this.http.get('api/bankroll/alerts');
    }
    static { this.ɵfac = function BankrollApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BankrollApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: BankrollApiService, factory: BankrollApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BankrollApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=bankroll-api.service.js.map