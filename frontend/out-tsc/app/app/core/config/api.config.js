import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';
export const API_BASE_URL = new InjectionToken('API_BASE_URL', {
    providedIn: 'root',
    factory: () => environment.apiBaseUrl
});
//# sourceMappingURL=api.config.js.map