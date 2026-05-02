import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class SettingsApiService {
    constructor() {
        this.http = inject(HttpClient);
    }
    getSettings() {
        return this.http.get('api/settings');
    }
    getIntegrations() {
        return this.http.get('api/settings/integrations');
    }
    validateSettings(request) {
        return this.http.post('api/settings/validate', request);
    }
    getLogs() {
        return this.http.get('api/settings/logs');
    }
    static { this.ɵfac = function SettingsApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SettingsApiService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: SettingsApiService, factory: SettingsApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SettingsApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=settings-api.service.js.map