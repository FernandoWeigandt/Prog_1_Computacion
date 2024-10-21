import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const roleGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const token: any = localStorage.getItem('token');
  const decoded: any = jwtDecode(token);
  if (token && decoded.role === 'admin' || decoded.role === 'librarian') {
    return true;
  }
  router.navigateByUrl('home');
  return false;
};
