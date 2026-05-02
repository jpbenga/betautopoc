import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class CoverageApiService {
    constructor() {
        this.http = inject(HttpClient);
    }
    getFootballLeagues() {
        return this.http.get('api/coverage/football/leagues');
    }
    updateFootballLeague(leagueId, request) {
        return this.http.patch(`api/coverage/football/leagues/${leagueId}`, request);
    }
    static { this.ɵfac = function CoverageApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CoverageApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: CoverageApiService, factory: CoverageApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CoverageApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=coverage-api.service.js.map