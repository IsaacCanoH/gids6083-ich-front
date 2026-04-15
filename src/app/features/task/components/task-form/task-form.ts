import { Component, EventEmitter, Input, Output, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { CreateTaskRequest } from '../../models/create-task-request.model';
import { CommonModule } from '@angular/common';
import { FormValidators } from '../../../../shared/validators/form-validators';
import { blockSpace } from '../../../../shared/utils/input.utils';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  private readonly fb = inject(FormBuilder);
  readonly blockSpace = blockSpace;

  @Input() initialData: Task | null = null;
  @Output() formSubmit = new EventEmitter<CreateTaskRequest>();

  readonly form = this.fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        FormValidators.textWithValidSpaces(),
        FormValidators.patternValidator(
          FormValidators.onlyLettersAndNumbers,
          'onlyLettersAndNumbers'
        )
      ]
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        FormValidators.textWithValidSpaces(),
        FormValidators.patternValidator(
          FormValidators.onlyLettersAndNumbers,
          'onlyLettersAndNumbers'
        )

      ]
    ],
    priority: [false]
  });

  ngOnInit(): void {
    if (this.initialData) {
      this.form.patchValue({
        name: this.initialData.name.trim(),
        description: this.initialData.description.trim(),
        priority: this.initialData.priority,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const value = this.form.value as CreateTaskRequest;
    this.formSubmit.emit(value);
  }
}
