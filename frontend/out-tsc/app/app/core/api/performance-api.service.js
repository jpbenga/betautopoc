import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class PerformanceApiService {
    constructor() {
        this.http = inject(HttpClient);
    }
    getSummary() {
        return this.http.get('api/performance/summary');
    }
    getAccuracy() {
        return this.http.get('api/performance/accuracy');
    }
    getRoi() {
        return this.http.get('api/performance/roi');
    }
    getCalibration() {
        return this.http.get('api/performance/calibration');
    }
    getStrategiesCompare() {
        return this.http.get('api/performance/strategies/compare');
    }
    getMarkets() {
        return this.http.get('api/performance/markets');
    }
    getDrift() {
        return this.http.get('api/performance/drift');
    }
    getDataQuality() {
        return this.http.get('api/performance/data-quality');
    }
    getLogs() {
        return this.http.get('api/performance/logs');
    }
    static { this.ɵfac = function PerformanceApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PerformanceApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: PerformanceApiService, factory: PerformanceApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PerformanceApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=performance-api.service.js.map