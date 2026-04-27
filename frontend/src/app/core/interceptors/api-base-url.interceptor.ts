import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL } from '../config/api.config';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiBaseUrl = inject(API_BASE_URL);
  if (/^https?:\/\//.test(req.url)) {
    return next(req);
  }

  const url = `${apiBaseUrl.replace(/\/$/, '')}/${req.url.replace(/^\//, '')}`;
  return next(req.clone({ url }));
};
