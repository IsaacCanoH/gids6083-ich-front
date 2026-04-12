import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginForm } from '../../components/login-form/login-form';
import { AuthApiService } from '../../services/auth-api.service';
import { LoginRequest } from '../../models/login-request.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../../core/services/notification.service';
import { ApiError } from '../../../../core/models/api-error.model';

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


  onSubmit(credentials: LoginRequest): void {

    this.authApiSvc
      .login(credentials)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error: ApiError) => {
          this.notification.error(
            'Error al iniciar sesión',
            error.message
          );
        }
      });
  }
}
