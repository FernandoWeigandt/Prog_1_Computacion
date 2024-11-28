import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    return this.httpClient.get('/api/authors?name='+name+'&lastname='+lastname);
  }
}
