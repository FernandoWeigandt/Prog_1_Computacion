import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const userRoleGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const token: any = localStorage.getItem('token');
  const decoded: any = jwtDecode(token);
  if (token && decoded.role === 'user') {
    return true;
  }
  router.navigateByUrl('settings');
  return false;
};
