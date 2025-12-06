import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TokenService } from '../../shared/services/token.service';

/**
 * Guard básico: solo verifica que haya usuario logueado.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.hasUser()) {
    return true;
  }

  router.navigate(['/iam/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

/**
 * Convierte "ADMIN" -> "Admin", "DOCTOR" -> "Doctor", "PATIENT" -> "Patient"
 */
function toTitleCase(role: string): string {
  if (!role) return '';
  return role.charAt(0) + role.slice(1).toLowerCase();
}

/**
 * Guard por roles: usa los roles definidos en route.data['roles'].
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const currentUser = tokenService.currentUser();
  if (!currentUser) {
    router.navigate(['/iam/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  // Si la ruta no define roles, con estar logueado basta
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const userRolePretty = toTitleCase(currentUser.role); // "DOCTOR" -> "Doctor"

  if (allowedRoles.includes(userRolePretty)) {
    return true;
  }

  router.navigate(['/access-denied']);
  return false;
};

/**
 * Guard para páginas públicas (login/register).
 */
export const publicGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.hasUser()) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
