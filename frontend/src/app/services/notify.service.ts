import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private httpClient: HttpClient) { }

  url = '/api'

  getNotifications(page: number): Observable<any> {
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    return this.httpClient.get(this.url+'/notifications'+`?page=${page}`);
  }

  postNotification(dataNotification: any): Observable<any> {
    return this.httpClient.post(this.url+'/notifications', dataNotification).pipe(take(1));
  }

  deleteNotification(id: number): Observable<any> {
    return this.httpClient.delete(`${this.url}/notification/${id}`).pipe(take(1));
  }

}
