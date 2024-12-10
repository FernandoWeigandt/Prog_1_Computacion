import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private httpClient: HttpClient) { }

  url = '/api'

  getNotifications(): Observable<any> {
    return this.httpClient.get(this.url+'/notifications');
  }

  postNotification(dataNotification: any): Observable<any> {
    return this.httpClient.post(this.url+'/notifications', dataNotification).pipe(take(1));
  }

}
