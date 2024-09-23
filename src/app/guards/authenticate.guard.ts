import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@shared/services/user.service';

export const authenticateGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (await userService.isLoggedIn()) {
    console.log('is LoggeIn');
    return true;
  } else {
    console.log('nott LoggeIn');
    router.navigate(['/login']);
    return false;
  }
};
