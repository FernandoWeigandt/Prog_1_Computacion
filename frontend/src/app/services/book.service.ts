import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  url = '/api';

  constructor(private httpClient: HttpClient) { }

  getBook(id: Number): Observable<any> {
    return this.httpClient.get('/api/book/'+id);
  }
}
