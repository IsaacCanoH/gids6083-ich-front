import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginForm } from '../../components/login-form/login-form';
import { AuthApiService } from '../../services/auth-api.service';
import { LoginRequest } from '../../models/login-request.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from '../../../../core/services/session.service';
import { switchMap } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoaderService } from '../../../../core/services/loader.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule,LoginForm,RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly authApiSvc = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notification = inject(NotificationService);
  private readonly loader = inject(LoaderService);


  onSubmit(credentials: LoginRequest): void {
    this.loader.show();

    this.authApiSvc
      .login(credentials)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.loader.hide();
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          if (error.status === 401) {
            this.notification.error(
              'Credenciales incorrectas',
              'El usuario o la contraseña son incorrectos. Verifícalos e inténtalo nuevamente.'
            );
          } else {
            this.notification.error(
              'Error al iniciar sesión',
              'No se pudo iniciar sesión.'
            );
          }

          this.loader.hide();
        }
      });
  }
}
