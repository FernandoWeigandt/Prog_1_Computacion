import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  url = '/api';

  constructor(private httpClient: HttpClient) { }

  getBooks(page: number): Observable<any> {
    return this.httpClient.get('/api/books?page='+page);
  }

  getBooksBySearchQuery(query: any): Observable<any> {
    return this.httpClient.get(`/api/books?${query.filter}=${query.pattern}`);
  }
}
