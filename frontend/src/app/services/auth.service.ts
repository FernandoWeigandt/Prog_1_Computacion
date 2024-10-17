import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = '/api';

  constructor(private httpClient: HttpClient) { 
    // This service can now make HTTP requests via `this.http`.
  }

  login(dataLogin: any): Observable<any> {
    return this.httpClient.post(this.url+'/auth/login', dataLogin).pipe(take(1));
  }
}
