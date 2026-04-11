import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUserRequest } from '../../models/create-user-request.model';

@Component({
  selector: 'app-user-register-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './user-register-form.html',
  styleUrl: './user-register-form.css',
})
export class UserRegisterForm {
  private readonly fb = inject(FormBuilder);

  @Output() formSubmit = new EventEmitter<CreateUserRequest>();

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
  });

  readonly showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  submit(): void {
    if (this.form.invalid) return;

    this.formSubmit.emit(this.form.getRawValue());
  }
}
