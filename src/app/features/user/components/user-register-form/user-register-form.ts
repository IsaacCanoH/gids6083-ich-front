import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUserRequest } from '../../models/create-user-request.model';
import { CustomValidators } from '../../../../core/validators/custom-validators';
import { blockSpace } from '../../../../core/utils/input.utils';

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
        CustomValidators.noSpaces(),
        CustomValidators.patternValidator(CustomValidators.onlyLetters, 'onlyLetters')
      ]
    ],
    lastname: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        CustomValidators.noSpaces(),
        CustomValidators.patternValidator(CustomValidators.onlyLetters, 'onlyLetters')
      ]
    ],
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        CustomValidators.noSpaces(),
        CustomValidators.patternValidator(CustomValidators.onlyLettersAndNumbers, 'onlyLettersAndNumbers')
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        CustomValidators.noSpaces(),
        CustomValidators.patternValidator(CustomValidators.password, 'invalidPassword')

      ]
    ],
    confirmPassword: [
      '',
      [
        Validators.required,
        Validators.maxLength(8),
        Validators.maxLength(50),
        CustomValidators.noSpaces()
      ]
    ]
  },{ validators: [CustomValidators.matchFields('password','confirmPassword')]});

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
