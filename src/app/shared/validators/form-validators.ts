import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormValidators {
  static readonly onlyLetters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;
  static readonly onlyLettersAndNumbers = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;
  static readonly password = /^[a-zA-Z0-9@#$%&*!?._-]+$/;

  static textWithValidSpaces(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string | null;

      if (!value) return null;

      const trimmedValue = value.trim();

      // Error si todo son espacios
      if (trimmedValue.length === 0) {
        return { invalidSpaces: true };
      }

      const lettersCount = (trimmedValue.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9]/g) || []).length;
      const spacesCount = (trimmedValue.match(/\s/g) || []).length;

      // Error si hay más espacios que letras/números
      if (spacesCount > lettersCount) {
        return { invalidSpaces: true };
      }

      return null;
    };
  }

  static noSpaces(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string | null;

      if (!value) return null;

      return /\s/.test(value) ? { noSpaces: true } : null;
    };
  }

  static patternValidator(regex: RegExp, errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string | null;

      if (!value) return null;

      return regex.test(value) ? null : { [errorKey]: true };
    };
  }

  static matchFields(fieldName: string, confirmFieldName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const field = group.get(fieldName);
      const confirmField = group.get(confirmFieldName);

      if (!field || !confirmField) return null;

      if (field.value !== confirmField.value) {
        confirmField.setErrors({
          ...(confirmField.errors || {}),
          passwordMismatch: true
        });
        return { passwordMismatch: true };
      }

      if (confirmField.errors?.['passwordMismatch']) {
        const { passwordMismatch, ...rest } = confirmField.errors;
        confirmField.setErrors(Object.keys(rest).length ? rest : null);
      }

      return null;
    };
  }
}
