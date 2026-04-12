import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from '../../models/login-request.model';
import { CommonModule } from '@angular/common';
import { blockSpace } from '../../../../core/utils/input.utils';
import { CustomValidators } from '../../../../core/validators/custom-validators';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private readonly fb = inject(FormBuilder);
  readonly blockSpace = blockSpace;

  @Output() formSubmit = new EventEmitter<LoginRequest>();

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), CustomValidators.noSpaces()]],
    password: ['', [Validators.required, Validators.minLength(3), CustomValidators.noSpaces()]]
  })

  readonly showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  submit(): void {
    if (this.form.invalid) return;

    this.formSubmit.emit(this.form.getRawValue());
  }
}
