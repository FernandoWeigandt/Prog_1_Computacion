import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url = '/api';

  constructor(private httpClient: HttpClient) {
    // This service can now make HTTP requests via `this.http`.
  }

  getUsers(page: number, filters: any): Observable<any> {
    let params = `?page=${page}`;
    for (let filter of filters) {
      params += `&${filter.query}=${filter.pattern}`;
    }
    return this.httpClient.get(this.url+`/users${params}`);
  }

  getUser(id: Number): Observable<any> {
    return this.httpClient.get(this.url+`/user/${id}`);
  }

  updateUser(id: Number, dataUser: any): Observable<any> {
    return this.httpClient.put(this.url+`/user/${id}`, dataUser).pipe(take(1));
  }

  deleteUser(id: number): Observable<any> {
    return this.httpClient.delete(this.url + `/user/${id}`)
  }
}
