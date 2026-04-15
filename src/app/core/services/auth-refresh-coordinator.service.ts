import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthApiService } from '../../features/auth/services/auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthRefreshCoordinatorService {
  private readonly authApiService = inject(AuthApiService);

  private isRefreshing = false;
  private readonly refreshStateSubject = new BehaviorSubject<boolean | null>(null);

  // Permite saber su hay un refresh funcionando.
  isRefreshInProgress(): boolean {
    return this.isRefreshing;
  }

  // Se usa por otras request que llegan cuando otras ya estan haciendo el refresh.
  waitForRefreshResult<T>(retryRequest: () => Observable<T>): Observable<T> {
    return this.refreshStateSubject.pipe(
      // Espera a que el refresh tenga un resultado real: true o false
      filter((result) => result !== null),
      // Toma el primer resultado y deja de escuchar.
      take(1),
      // Si el refresh salió bien, reintenta la request original
      switchMap((result) => {
        if (result) {
          return retryRequest();
        }

        return throwError(() => this.createUnauthorizedError());
      }),
    );
  }

  // Inicia el proceso del refresh y si bien sale reintenta la request original.
  refreshAndRetry<T>(retryRequest: () => Observable<T>): Observable<T> {
    // Marca que ya inicio el refresh.
    this.isRefreshing = true;
    // Inicia el estado compartido para que otras request esperen.
    this.refreshStateSubject.next(null);

    return this.authApiService.refresh().pipe(
      switchMap(() => {
        // El refresh salio bien, ya no esta en proceso.
        this.isRefreshing = false;
        // Avisa a los demas request que ya pueden continuar.
        this.refreshStateSubject.next(true);
        // Reintenta la request original.
        return retryRequest();
      }),
      catchError((error) => {
        this.isRefreshing = false;
        this.refreshStateSubject.next(false);

        return throwError(() => error);
      }),
    );
  }

  private createUnauthorizedError(): { status: number; message: string } {
    return {
      status: 401,
      message: 'No autorizado. Inicia sesión nuevamente',
    };
  }
}
