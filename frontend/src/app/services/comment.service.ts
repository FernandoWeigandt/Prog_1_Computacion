import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) { }

  url = '/api'

  postComment(dataComment: any): Observable<any> {
    return this.httpClient.post(this.url+'/comments', dataComment).pipe(take(1));
  }

  deleteComment(id: Number): Observable<any> {
    return this.httpClient.delete(this.url+'/comment/'+id).pipe(take(1));
  }

  editComment(id: Number, dataComment: any): Observable<any> {
    return this.httpClient.put(this.url+'/comment/'+id, dataComment).pipe(take(1));
  }
}
