import { Component, EventEmitter, Input, Output, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { CreateTaskRequest } from '../../models/create-task-request.model';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../../../../core/validators/custom-validators';
import { blockSpace } from '../../../../core/utils/input.utils';

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
        CustomValidators.noSpaces(),
        CustomValidators.patternValidator(
          CustomValidators.onlyLettersAndNumbers,
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
        CustomValidators.noSpaces(),
        CustomValidators.patternValidator(
          CustomValidators.onlyLettersAndNumbers,
          'onlyLettersAndNumbers'
        )

      ]
    ],
    priority: [false]
  });

  ngOnInit(): void {
    if (this.initialData) {
      this.form.patchValue({
        name: this.initialData.name,
        description: this.initialData.description,
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
