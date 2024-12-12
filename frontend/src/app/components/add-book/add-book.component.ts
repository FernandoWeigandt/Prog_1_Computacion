import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NewAuthorComponent } from '../new-author/new-author.component';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthorsService } from '../../services/authors.service';
import { NgClass } from '@angular/common';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [ReactiveFormsModule, NewAuthorComponent, NgClass],
  templateUrl: './add-book.component.html',
  styles: ``
})
export class AddBookComponent {
  @Output() bookCreated = new EventEmitter();
  @Output() errorBookCreated = new EventEmitter();
  title: string = '';
  description: string = '';
  image: string = '';
  gender: string = 'Otro';
  book_authors: any = [];
  authors: any[] = [];
  new_authors: any[] = [];

  constructor(
    private authorsService: AuthorsService,
    private booksService: BooksService
  ) {}

  private fb = inject(NonNullableFormBuilder)

  editBookForm = this.fb.group(
    {
      titleInput: [this.title, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(200)
      ]],
      descriptionInput: [this.description, [
        Validators.required,
        Validators.minLength(100),
        Validators.maxLength(2000)
      ]],
      genderInput: [this.gender, [
        Validators.required
      ]],
      authorFilter: ['']
  })

  parseAuthors(authors: any): string[] {
    let result: string[] = [];
    for (let i = 0; i < authors.length; i++) {
      result.push(authors[i].name + ' ' + authors[i].lastname);
    }
    return result;
  }

  getAuthors() {
    const query = this.editBookForm.controls['authorFilter'].value
    if (typeof query === 'string') {
      this.authorsService.getAuthors_by_name_or_lastname(query).subscribe((answer:any) => {
        this.authors = answer.authors;
      })
    } else {
      this.authorsService.getAuthors_by_name_or_lastname('').subscribe((answer:any) => {
        this.authors = answer.authors;
      })
    }
  }

  repeatedAuthor(test_id: number): boolean {
    for (let id of this.new_authors) {
      if (id == test_id) {
        return true
      }
    }
    return false
  }

  addAuthor() {
    const input = this.editBookForm.controls['authorFilter'].value;
    const name: string = input?.split(' ')[0] || '';
    const lastname: string = input?.split(' ')[1] || '';
    if (!name || !lastname) {
      return;
    } else {
      this.authorsService.getAuthor_by_fullname(name, lastname).subscribe((answer:any) => {
        const id = answer.authors[0].id;
        if (id && !(this.repeatedAuthor(id))) {
          this.new_authors.push(id);
          this.book_authors.push(answer.authors[0]);
          this.editBookForm.controls['authorFilter'].setValue('');
        }
      })      
    }
  }

  deleteAuthor(id: number) {
    for (let i = 0; i < this.new_authors.length; i++) {
      if (this.new_authors[i] == id) {
        this.new_authors.splice(i, 1);
      }
    }
    for (let i = 0; i < this.book_authors.length; i++) {
      if (this.book_authors[i].id == id) {
        this.book_authors.splice(i, 1);
      }
    }
  }

  displayError(controlName:string): string | null {
    let control: any;
    control = this.editBookForm.get(controlName);
    if (control?.hasError('required')) return 'Este campo es obligatorio';
    if (control?.hasError('minlength')) return `Este campo debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    if (control?.hasError('maxlength')) return `Este campo no debe superar los ${control.errors?.['maxlength'].requiredLength} caracteres`;
    return null;
  }

  uploadImage(event: any) {
    console.log(event);
  }

  save() {
    let title: string = this.editBookForm.controls.titleInput.value;
    let description: string = this.editBookForm.controls.descriptionInput.value;
    if (!title.trim()) {
      title = this.title;
    }
    if (!description.trim()) {
      description = this.description;
    }
    let data = {
      'title': title,
      'description': description,
      'authors': this.new_authors,
      'gender': this.editBookForm.controls.genderInput.value || this.gender
    }
    this.booksService.createBook(data).subscribe((answer) => {
      this.editBookForm.reset();
      this.bookCreated.emit(`Libro Creado, identificador: ${answer.id}`);
    }, (error) => {
      this.errorBookCreated.emit('Error al crear libro.');
    })
  }

  get invalidTitleInput() {
    return this.editBookForm.controls.titleInput.invalid && (this.editBookForm.controls.titleInput.touched || this.editBookForm.controls.titleInput.dirty)
  }

  get invalidDescriptionInput() {
    return this.editBookForm.controls.descriptionInput.invalid && (this.editBookForm.controls.descriptionInput.touched || this.editBookForm.controls.descriptionInput.dirty)
  }
}
