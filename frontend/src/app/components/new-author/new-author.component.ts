import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthorsService } from '../../services/authors.service';
import { uniqueAuthorValidator } from './uniqueAuthor.validator';

@Component({
  selector: 'app-new-author',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-author.component.html',
  styles: ``,
})

export class NewAuthorComponent {

  constructor (
    private authorService: AuthorsService,
    private uniqueAuthor: uniqueAuthorValidator,
  ) {}

  private fb = inject(NonNullableFormBuilder);
  
  authorForm = this.fb.group(
    {
      name: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]],
      lastname: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]],
    },
    {
      // asyncValidators: [this.uniqueAuthor.validate.bind(this.uniqueAuthor)],
      // updateOn: 'blur'
    }
  );
  

  get authorExists() {
    const name = this.authorForm.controls.name.value;
    const lastname = this.authorForm.controls.lastname.value;
    if (!name.trim() || !lastname.trim()) {
      return this.authorForm.hasError('required');
    } else {
      this.authorService.getAuthor_by_fullname(name, lastname).subscribe((answer: any) => {
        if (answer.authors.length > 0) {
          console.log(answer);
          this.authorForm.setErrors({ 'authorExists': true });
        }
      })
    }
    return null;
  }

  get nameInvalid(): boolean {
    return this.authorForm.controls.name.invalid && (this.authorForm.controls.name.touched || this.authorForm.controls.name.dirty)
  }

  get lastnameInvalid(): boolean {
    return this.authorForm.controls.lastname.invalid && (this.authorForm.controls.lastname.touched || this.authorForm.controls.lastname.dirty)
  }

  onSubmit() {
    if (!this.authorExists) {
      console.log(`Author dont exist, adding: ${this.authorForm.value}`);
    }
    // this.authorService.addAuthor(this.authorForm.value).subscribe();
  }
}


  // authorForm: FormGroup = new FormGroup({
  //   name: new FormControl('', [
  //     Validators.required, 
  //     Validators.minLength(4),
  //     lettersOnlyValidator
  //   ]),
  //   lastname: new FormControl('', [
  //     Validators.required,
  //     Validators.minLength(4),
  //     lettersOnlyValidator
  //   ]),
  // });

  // constructor(
  //   private fb: FormBuilder,
  //   private authorService: AuthorsService,
  //   private customValidators: CustomValidators
  // ) {}

  // authorForm = this.fb.group({
  //   name: '',
  //   lastname: '',
  // })

  // authorExists(control: FormControl) {
  //   const author = control.value.name + ' ' + control.value.lastname
  //   this.authorService.getAuthors_by_name_or_lastname(author).subscribe((answer: any) => {
  //     if (answer.authors.length > 0) {
  //       control.setErrors({ 'authorExists': true });
  //     } else {
  //       control.setErrors(null);
  //     }
  //   })
  // }

  // createAuthor() {
  //   this.authorService.addAuthor(this.authorForm.value).subscribe();
  // }