import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from '../../models/login-request.model';
import { CommonModule } from '@angular/common';
import { blockSpace } from '../../../../shared/utils/input.utils';
import { FormValidators } from '../../../../shared/validators/form-validators';

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
    username: ['', [Validators.required, Validators.minLength(3), FormValidators.noSpaces()]],
    password: ['', [Validators.required, Validators.minLength(3), FormValidators.noSpaces()]]
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
