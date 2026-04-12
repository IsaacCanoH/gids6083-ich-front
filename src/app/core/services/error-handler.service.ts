import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiError } from "../models/api-error.model";
import { throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService  {
  handleHttpError(error: HttpErrorResponse) {
    let customError: ApiError;

    if (error.status === 0) {
      customError = {
        status: 0,
        message: 'No se pudo conectar con el servidor'
      };
    } else if (error.status === 400) {
      customError = {
        status: 400,
        message: 'Los datos enviados no son válidos'
      };
    } else if (error.status === 401) {
      customError = {
        status: 401,
        message: 'No autorizado. Inicia sesión nuevamente'
      };
    } else if (error.status === 403) {
      customError = {
        status: 403,
        message: 'No tienes permisos para realizar esta acción'
      };
    } else if (error.status === 404) {
      customError = {
        status: 404,
        message: 'Recurso no encontrado'
      };
    } else if (error.status === 500) {
      customError = {
        status: 500,
        message: 'Error interno del servidor'
      };
    } else {
      customError = {
        status: error.status,
        message: 'Ocurrió un error inesperado'
      };
    }

    return throwError(() => customError);
  }
}
