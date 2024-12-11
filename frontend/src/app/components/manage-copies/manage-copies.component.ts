import { Component, input, Input } from '@angular/core';
import { BookCopyService } from '../../services/book-copy.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-copies',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './manage-copies.component.html',
  styles: ``
})
export class ManageCopiesComponent {
  @Input() id: number = 0
  @Input() copies: any[] = []
  
  constructor(
    private bookCopyService: BookCopyService,
  ) {}

  addQuantity = new FormControl(0, [
    Validators.pattern(/^[0-9]*$/),
    Validators.maxLength(2)
  ]);

  get addQuantityInvalid(): boolean {
    return this.addQuantity.invalid && (this.addQuantity.touched || this.addQuantity.dirty)
  }

  get copiesQuantity(): number {
    return this.copies.length
  }

  addCopies() {
    if (this.addQuantity.valid && this.addQuantity.value) {
      this.bookCopyService.addCopy(this.id, this.addQuantity.value).subscribe((answer) => {
        const new_copies = answer.book_copies
        for (let copy of new_copies) {
          this.copies.push(copy)
        }
        this.showAlert('Copias agregadas exitosamente.')
      }, error => {
        this.showAlert('Ocurrio un error al agregar una copia.')
      })
    }
  }

  showAlert(message: string) {
    const alertPlaceholder = document.getElementById('addAlertPlaceholder')
    const wrapper = document.createElement('div')
    let type = 'success'
    if (message === 'Ocurrio un error al agregar una copia.') {
      type = 'danger'
    }
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
    alertPlaceholder?.append(wrapper)
  }

  deleteCopy(id: number) {
    this.bookCopyService.deleteCopy(id).subscribe(() => {
      this.deleteError('Copia eliminada exitosamente.')
      this.copies = this.copies.filter(copy => copy.id !== id)
    }, error => {
      this.deleteError('Ocurrio un error al eliminar una copia, recuerda que solo puedes eliminar copias sin prestamos.')
    })
  }

  deleteError(message: string) {
    const alertPlaceholder = document.getElementById('deleteAlertPlaceholder')
    const wrapper = document.createElement('div')
    let type = 'danger'
    if (message === 'Copia eliminada exitosamente.') {
      type = 'success'
    }
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
    alertPlaceholder?.append(wrapper)
  }
}
