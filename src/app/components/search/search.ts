import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly submitted = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    city: ['', Validators.required],
  });

  protected get cityControl() {
    return this.form.controls.city;
  }

  protected get isCityMissing(): boolean {
    return this.cityControl.value.trim().length === 0;
  }

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.isCityMissing) {
      return;
    }

    this.router.navigate(['/weather', this.cityControl.value.trim()]);
  }
}
