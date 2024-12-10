import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url = '/api';

  constructor(private httpClient: HttpClient) {
    // This service can now make HTTP requests via `this.http`.
  }

  getUsers(page: number, filters: any = []): Observable<any> {
    let params = `?page=${page}`;
    for (let filter of filters) {
      params += `&${filter.value.filter}=${filter.value.pattern}`;
    }
    return this.httpClient.get(this.url+`/users${params}`);
  }

  getUser(id: Number): Observable<any> {
    return this.httpClient.get(this.url+`/user/${id}`);
  }
}
