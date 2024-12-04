import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentsService {

  url='/api'

  constructor(private httpClient: HttpClient) { }

  getRents(page:number=1): Observable<any> {
    return this.httpClient.get('/api/rents?page='+page)
  }
}
