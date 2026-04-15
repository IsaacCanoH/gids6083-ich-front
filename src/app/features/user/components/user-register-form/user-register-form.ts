import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUserRequest } from '../../models/create-user-request.model';
import { FormValidators } from '../../../../shared/validators/form-validators';
import { blockSpace } from '../../../../shared/utils/input.utils';

@Component({
  selector: 'app-user-register-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './user-register-form.html',
  styleUrl: './user-register-form.css',
})
export class UserRegisterForm {
  private readonly fb = inject(FormBuilder);
  readonly blockSpace = blockSpace;

  @Output() formSubmit = new EventEmitter<CreateUserRequest>();

  readonly form = this.fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        FormValidators.textWithValidSpaces(),
        FormValidators.patternValidator(FormValidators.onlyLetters, 'onlyLetters')
      ]
    ],
    lastname: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        FormValidators.textWithValidSpaces(),
        FormValidators.patternValidator(FormValidators.onlyLetters, 'onlyLetters')
      ]
    ],
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        FormValidators.noSpaces(),
        FormValidators.patternValidator(FormValidators.onlyLettersAndNumbers, 'onlyLettersAndNumbers')
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        FormValidators.noSpaces(),
        FormValidators.patternValidator(FormValidators.password, 'invalidPassword')

      ]
    ],
    confirmPassword: [
      '',
      [
        Validators.required,
        Validators.maxLength(8),
        Validators.maxLength(50),
        FormValidators.noSpaces()
      ]
    ]
  },{ validators: [FormValidators.matchFields('password','confirmPassword')]});

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(value => !value);
  }

  submit(): void {
    if (this.form.invalid) return;

    const { confirmPassword, ...userData } = this.form.getRawValue();
    this.formSubmit.emit(userData);
  }
}
