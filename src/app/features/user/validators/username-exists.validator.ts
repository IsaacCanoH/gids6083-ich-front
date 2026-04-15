import { inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { UserApiService } from '../services/user-api.service';
import { catchError, map, of } from 'rxjs';

export function usernameExistsValidator(): AsyncValidatorFn {
  const userApiService = inject(UserApiService);

  return (control: AbstractControl) => {
    if (!control.value) return of(null);

    return userApiService.checkUsername(control.value).pipe(
      map(response => response.exists ? { usernameExists: true } : null),
      catchError(() => of(null))
    );
  };
}
