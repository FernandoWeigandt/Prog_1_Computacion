import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentsService {

  url='/api'

  constructor(private httpClient: HttpClient) { }

  getRents(page:number=1, filters: any): Observable<any> {
    return this.httpClient.get('/api/rents?page='+page)
  }

  postRent(dataRent: any): Observable<any> {
    return this.httpClient.post(this.url+'/rents', dataRent).pipe(take(1));
  }
}
