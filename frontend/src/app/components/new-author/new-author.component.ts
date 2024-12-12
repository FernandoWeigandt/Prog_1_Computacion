import { Component, inject, Input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthorsService } from '../../services/authors.service';
import { uniqueAuthorValidator } from './uniqueAuthor.validator';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-author',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-author.component.html',
  styles: ``,
})

export class NewAuthorComponent {
  @Input() createBook = false;

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

  async authorExists(): Promise<boolean> {
    const name = this.authorForm.controls.name.value;
    const lastname = this.authorForm.controls.lastname.value;
    const answer = await this.authorService.getAuthor_by_fullname(name, lastname).toPromise();
    return answer.authors.length > 0;
  }

  get nameInvalid(): boolean {
    return this.authorForm.controls.name.invalid && (this.authorForm.controls.name.touched || this.authorForm.controls.name.dirty)
  }

  get lastnameInvalid(): boolean {
    return this.authorForm.controls.lastname.invalid && (this.authorForm.controls.lastname.touched || this.authorForm.controls.lastname.dirty)
  }

  async onSubmit() {
    if (!(await this.authorExists())) {
      this.authorService.addAuthor(this.authorForm.value).subscribe();
    } else {
      window.alert('El autor ya existe');
    }
  }
}