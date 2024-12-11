import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  url = '/api';

  constructor(private httpClient: HttpClient) { }

  getBook(id: Number): Observable<any> {
    return this.httpClient.get(this.url+'/book/'+id);
  }

  deleteBook(id: Number): Observable<any> {
    return this.httpClient.delete(this.url+'/book/'+id);
  }

  updateBook(id: Number, dataBook: any): Observable<any> {
    return this.httpClient.put(this.url+'/book/'+id, dataBook).pipe(take(1));
  }
}
