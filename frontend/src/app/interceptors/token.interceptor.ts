import { HttpInterceptorFn } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded: any = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem('token');
      return next(req);
    }
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(authReq);
  }
  return next(req);
};
