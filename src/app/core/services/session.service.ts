import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthApiService } from '../../features/auth/services/auth-api.service';
import { CurrentUser } from '../../features/auth/models/current-user.model';
import { AuthState } from '../models/auth-state.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly authApiService = inject(AuthApiService);

  private readonly state = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
  });

  readonly user = computed(() => this.state().user);
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  readonly isLoading = computed(() => this.state().isLoading);

  loadSession(): Observable<CurrentUser | null> {
    this.patchState({ isLoading: true });

    return this.authApiService.me().pipe(
      tap((user) => {
        this.patchState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      }),
      catchError(() => {
        this.clearSession();
        this.patchState({ isLoading: false });
        return of(null);
      }),
    );
  }

  logout(): Observable<void> {
    return this.authApiService.logout().pipe(
      tap(() => {
        this.clearSession();
      }),
    );
  }

  setAuthenticatedUser(user: CurrentUser): void {
    this.patchState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  }

  clearSession(): void {
    this.patchState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }

  private patchState(partialState: Partial<AuthState>): void {
    this.state.update((currentState) => ({
      ...currentState,
      ...partialState,
    }));
  }
}
