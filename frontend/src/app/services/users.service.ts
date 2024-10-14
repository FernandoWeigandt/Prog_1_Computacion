import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url = '/api';

  constructor(private httpClient: HttpClient) { 
    // This service can now make HTTP requests via `this.http`.
  }

  getUsers(): Observable<any> {
    const auth_token = localStorage.getItem('token');
    if (auth_token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${auth_token}`);
    const options = { headers: headers };
    return this.httpClient.get(this.url+'/users', options);
    }
    return this.httpClient.get(this.url+'/users');
  }
}
