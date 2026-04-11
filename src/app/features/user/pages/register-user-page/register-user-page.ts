import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserRegisterForm } from '../../components/user-register-form/user-register-form';
import { UserApiService } from '../../services/user-api.service';
import { CreateUserRequest } from '../../models/create-user-request.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoaderService } from '../../../../core/services/loader.service';

@Component({
  selector: 'app-register-user-page',
  standalone: true,
  imports: [CommonModule,RouterLink,UserRegisterForm],
  templateUrl: './register-user-page.html',
  styleUrl: './register-user-page.css',
})
export class RegisterUserPage {
  private readonly userApiSvc = inject(UserApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notification = inject(NotificationService);
  private readonly loader = inject(LoaderService);

  onSubmit(payload: CreateUserRequest): void {
    this.loader.show();

    this.userApiSvc
      .create(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loader.hide();
          void this.router.navigate(['/auth/login']);
          this.notification.success(
            'Usuario registrado',
            'El usuario se registró correctamente.'
          );
        },
        error: (error) => {
          if (error.status === 400) {
            this.notification.error(
              'Usuario ya registrado',
              'El nombre de usuario ingresado ya está en uso. Por favor, elige otro.'
            );
          } else {
            this.notification.error(
              'Error al registrar usuario',
              'No se pudo completar el registro del usuario. Inténtalo nuevamente.'
            );
          }

          this.loader.hide();
        }
      })
  }
}
