import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TokenService } from '../../shared/services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.hasUser()) {
    return true;
  }

  router.navigate(['/iam/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const roleGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const currentUser = tokenService.getCurrentUser();

  if (!currentUser) {
    router.navigate(['/iam/login']);
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const userRole = currentUser.role;

  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/access-denied']);
  return false;
};

export const publicGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.hasUser()) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
