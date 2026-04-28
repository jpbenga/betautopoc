import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from './api.types';

export function toApiError(error: unknown): ApiError {
  if (error instanceof HttpErrorResponse) {
    const payload = error.error;
    if (payload && typeof payload === 'object' && 'error' in payload) {
      return payload as ApiError;
    }

    return {
      error: error.statusText || 'Request failed',
      detail: typeof payload === 'string' ? payload : error.message,
      code: String(error.status)
    };
  }

  return {
    error: 'Unexpected error',
    detail: error instanceof Error ? error.message : String(error)
  };
}
