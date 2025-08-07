import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('https://reqres.in')) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      'x-api-key': 'reqres-free-v1',
    },
  });

  return next(cloned);
};
