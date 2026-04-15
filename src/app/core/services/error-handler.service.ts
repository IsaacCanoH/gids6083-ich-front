import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiError } from "../models/api-error.model";
import { throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService  {
  mapHttpError(error: HttpErrorResponse) {
    const backendMessage = error.error?.error;

    const fallbackMessages: Record<number, string> = {
      0: 'No se pudo conectar con el servidor',
      400: 'Los datos enviados no son válidos',
      401: 'No autorizado. Inicia sesión nuevamente',
      403: 'No tienes permisos para realizar esta acción',
      404: 'Recurso no encontrado',
      500: 'Error interno del servidor'
    };

    const customError: ApiError = {
      status: error.status,
      message: backendMessage || fallbackMessages[error.status] || 'Ocurrió un error inesperado'
    };

    return throwError(() => customError);
  }
}
