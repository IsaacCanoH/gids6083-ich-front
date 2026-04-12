import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static readonly onlyLetters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;
  static readonly onlyLettersAndNumbers = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/;
  static readonly password = /^[a-zA-Z0-9@#$%&*!?._-]+$/;

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
