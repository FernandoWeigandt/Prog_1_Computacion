import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookCopyService {

  url = '/api';

  constructor(private httpClient: HttpClient) { }

  addCopy(bookId: number, quantity: number): Observable<any> {
    const data = {
      book_id: bookId,
      quantity: Number(quantity)
    }
    return this.httpClient.post(`${this.url}/copies`, data).pipe(take(1))
  }

  deleteCopy(id: number): Observable<any> {
    return this.httpClient.delete(`${this.url}/copy/${id}`).pipe(take(1))
  }
}
