import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  url = '/api'

  constructor(private httpClient: HttpClient) { }

  getAuthors(filter: string): Observable<any> {
    return this.httpClient.get('/api/authors?name_or_lastname='+filter);
  }
}
