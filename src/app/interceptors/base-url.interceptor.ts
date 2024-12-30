import { HttpInterceptorFn } from '@angular/common/http';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip if the URL is absolute (starts with 'http' or 'https')
  if (req.url.startsWith('http')) {
    return next(req); // Pass through without modification
  }

  // Avoid adding localhost base URL if the request is for the proxy (starts with /api)
  if (req.url.startsWith('/api')) {
    return next(req); // Do nothing and proceed with the request
  }

  // Otherwise, prepend the localhost base URL
  const reqClone = req.clone({
    url: `http://localhost:8080/${req.url}`,
  });

  return next(reqClone);
};

