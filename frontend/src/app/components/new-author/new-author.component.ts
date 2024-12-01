import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthorsService } from '../../services/authors.service';

@Component({
  selector: 'app-new-author',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-author.component.html',
  styles: ``,
})
export class NewAuthorComponent {

  newAuthorForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  constructor(
    private addAuthorService: AuthorsService
  ) {}

  authorExists(control: FormControl) {
    const author = control.value.name + ' ' + control.value.lastname
    this.addAuthorService.getAuthors_by_name_or_lastname(author).subscribe((answer: any) => {
      if (answer.authors.length > 0) {
        control.setErrors({ 'authorExists': true });
      } else {
        control.setErrors(null);
      }
    })
  }

  createAuthor() {
    this.addAuthorService.addAuthor(this.newAuthorForm.value).subscribe();
  }
}
