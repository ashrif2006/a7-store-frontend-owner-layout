import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  if(tokenService.get()){
    console.log(tokenService.get());
    return true;
  }
  return router.createUrlTree(['/login'])
};

export const guestGuard: CanActivateFn = (route, state) => {
  return true;
}