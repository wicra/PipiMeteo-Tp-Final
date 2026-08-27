import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly submitted = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    city: ['', Validators.required],
  });

  protected get cityControl() {
    return this.form.controls.city;
  }

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      return;
    }
  }
}
