// message.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:8080/api/messages';

  constructor(private http: HttpClient) { }

  sendMessage(messageRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send`, messageRequest);
  }

  getInbox(userId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inbox/${userId}`);
  }

  getChatHistory(user1Id: number, user2Id: number, productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history/${user1Id}/${user2Id}/${productId}`);
  }

  getChatHistoryWithProductName(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inbox-with-product/${userId}`);
  }
}
