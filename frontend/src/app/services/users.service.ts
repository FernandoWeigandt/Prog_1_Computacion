import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url = '/api';

  constructor(private httpClient: HttpClient) {
    // This service can now make HTTP requests via `this.http`.
  }

  getUsers(page: number): Observable<any> {
    const auth_token: any = localStorage.getItem('token');
    const decoded: any = jwtDecode(auth_token);
    if (auth_token && decoded.role === 'admin' || decoded.role === 'librarian') {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${auth_token}`);
      const options = { headers: headers };
      console.log(this.url+`/users?page=${page}${options}`)
      return this.httpClient.get(this.url+`/users?page=${page}`, options);
    }
    return this.httpClient.get(this.url+'/users');
  }

  getUserName(id: Number): Observable<any> {
    return this.httpClient.get(this.url+`/user/${id}`);
  }
}
