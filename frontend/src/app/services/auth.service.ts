import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = '/api';

  constructor(private httpClient: HttpClient) { }

  login(dataLogin: any): Observable<any> {
    return this.httpClient.post(this.url+'/auth/login', dataLogin).pipe(take(1));
  }

  isLibrarian(): boolean {
    return this.role === 'librarian';
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isUser(): any {
    return this.role === 'user';
  }
  
  isLoggedIn(): boolean {
    return this.isAdmin() || this.isLibrarian() || this.isUser();
  }

  get token(): any {
    const token = localStorage.getItem('token');
    if (!token) {
      return '';
    } else {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp > Date.now() / 1000) {
          return token;
        } else {
          localStorage.removeItem('token');
          return '';
        }
      } catch (e) {
        console.error('Invalid token format', e);
        return '';
      }
    }
  }

  get userId(): any {
    try {
      const token = this.token;
      if (!token) {
        return '';
      }
      const decoded: any = jwtDecode(token);
      return decoded.id;
    } catch (e) {
      console.error('Invalid token format', e);
      return '';
    }
  }

  get role(): string {
    const token = this.token;
    if (!token) {
      return '';
    }
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role;
    } catch (e) {
      console.error('Invalid token format', e);
      return '';
    }
  }
}
