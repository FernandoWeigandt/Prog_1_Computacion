import { Injectable } from "@angular/core";
import { AuthorsService } from "../../services/authors.service";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({providedIn: 'root'})
export class uniqueAuthorValidator implements AsyncValidator {
  constructor(private authorsService: AuthorsService) {}
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const name = control.get('name')?.value;
    const lastname = control.get('lastname')?.value;
    if (!name.trim() || !lastname.trim()) {
      return of({required: true});
    } else {
      return this.authorsService.getAuthor_by_fullname(name, lastname).pipe(
        map((answer: any) => {
          if (answer.authors.length > 0) {
            return of({ authorExists: true });
          } else {
            return of(null);
          }
        }),        
        catchError(() => of(null))
      )
    }
  }
}
