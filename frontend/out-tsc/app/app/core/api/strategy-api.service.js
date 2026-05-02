import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class StrategyApiService {
    constructor() {
        this.http = inject(HttpClient);
    }
    getCatalog() {
        return this.http.get('api/strategy');
    }
    getDetail(strategyFile) {
        const params = strategyFile ? new HttpParams().set('strategy_file', strategyFile) : undefined;
        return this.http.get('api/strategy/detail', { params });
    }
    activate(request) {
        return this.http.put('api/strategy/active', request);
    }
    save(request) {
        return this.http.put('api/strategy/config', request);
    }
    applyToRun(request) {
        return this.http.post('api/strategy/apply-to-run', request);
    }
    static { this.ɵfac = function StrategyApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StrategyApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: StrategyApiService, factory: StrategyApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StrategyApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=strategy-api.service.js.map