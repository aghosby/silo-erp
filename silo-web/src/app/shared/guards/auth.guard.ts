import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/utils/auth.service';
import { NotificationService } from '@services/utils/notification.service';
import { tap } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const notifyService = inject(NotificationService);
  const router = inject(Router);

  return authService.isLoggedIn.pipe(
    tap(loggedIn => {
      if (!loggedIn) {
        notifyService.showWarning('You are not logged in at the moment. Login and try again');
        router.navigate(['login']);
      }
    })
  );
};
