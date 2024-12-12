import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RentsService } from '../../services/rents.service';

@Component({
  selector: 'app-new-rent',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-rent.component.html',
  styles: ``
})
export class NewRentComponent {
  @Output() rentCreated = new EventEmitter()
  @Output() errorRentCreated = new EventEmitter()

  private fb = inject(NonNullableFormBuilder)

  rentForm = this.fb.group({
    book_copy_id: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]*$/)
    ]],
    user_id: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]*$/)
    ]],
    expiration_date: ['', [
      Validators.required
    ]]
  })

  constructor(
    private rentService: RentsService
  ) { }

  createRent() {
    console.log(this.rentForm.value);
    this.rentService.postRent(this.rentForm.value).subscribe({next: (res) => {
        console.log(res);
        this.rentCreated.emit()
      },error: (err) => {
        console.log(err);
        this.errorRentCreated.emit()
      }
    })
  }

  displayError(controlName:string): string | null {
    const control = this.rentForm.get(controlName);
    if (control?.hasError('required')) return 'Este campo es obligatorio';
    if (control?.hasError('pattern')) return 'El identificador debe contener solo números';
    return null;
  }

  get bookCopyIdInvalid(): boolean {
    return this.rentForm.controls.book_copy_id.invalid && (this.rentForm.controls.book_copy_id.touched || this.rentForm.controls.book_copy_id.dirty)
  }

  get userIdInvalid(): boolean {
    return this.rentForm.controls.user_id.invalid && (this.rentForm.controls.user_id.touched || this.rentForm.controls.user_id.dirty)
  }

  get expirationDateInvalid(): boolean {
    return this.rentForm.controls.expiration_date.invalid && (this.rentForm.controls.expiration_date.touched || this.rentForm.controls.expiration_date.dirty)
  }
}