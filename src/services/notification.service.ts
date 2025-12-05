import { inject, Injectable } from '@angular/core';

import { ApiService } from './Api.service';
import { Observable } from 'rxjs';
import { NotificationRequest } from 'src/app/Models/Requests/NotificationRequest';
import { NotificationPagedResponse } from 'src/app/Models/Responses/NotificationResponse';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiService = inject(ApiService);



  getNotifications(payload: NotificationRequest): Observable<NotificationPagedResponse> {
    return this.apiService.post<NotificationPagedResponse>('Notifications/SearchNotifications', payload);
  }

  markallAsRead(loggedId: string): Observable<void> {
    return this.apiService.get<void>('Notifications/MarkAllAsRead', { loggedId });
  }
}
