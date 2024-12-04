import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  url = '/api'

  constructor(private httpClient: HttpClient) { }

  getAuthors_by_name_or_lastname(filter: string): Observable<any> {
    return this.httpClient.get('/api/authors?name_or_lastname='+filter);
  }

  getAuthor_by_fullname(name: string, lastname: string): Observable<any> {
    return this.httpClient.get(`/api/authors?fullname=${name}%20${lastname}`);
  }

  authorExists(name: string, lastname: string): Observable<boolean> {
    if (!name.trim() || !lastname.trim()) {
      return of(false);
    }
    this.getAuthor_by_fullname(name, lastname).subscribe((answer: any) => {
      if (answer.authors.length > 0) {
        return of(true)
      } else {
        return of(false)
      }
    })
    return of(false)
  }

  addAuthor(author: any): Observable<any> {
    return this.httpClient.post('/api/authors', author);
  }
}
