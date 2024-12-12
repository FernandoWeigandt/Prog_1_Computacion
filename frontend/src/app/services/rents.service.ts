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
    return this.httpClient.get('/api/rents?page='+page+'&'+filters)
  }

  editRent(id: number, dataRent: any): Observable<any> {
    return this.httpClient.put(this.url+'/rent/'+id, dataRent).pipe(take(1));
  }

  postRent(dataRent: any): Observable<any> {
    return this.httpClient.post(this.url+'/rents', dataRent).pipe(take(1));
  }

  deleteRent(id: number): Observable<any> {
    return this.httpClient.delete(this.url+'/rent/'+id).pipe(take(1));
  }
}
