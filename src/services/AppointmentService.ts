import { inject, Injectable } from '@angular/core';
import { ApiService } from './Api.service';
import { Observable } from 'rxjs';
import { AppointmentDetailsResponse } from 'src/app/Models/Responses/AppointmentResponses';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiService = inject(ApiService);

  getAppointment(appointmentId: string, en: 'EN' | 'AR'): Observable<AppointmentDetailsResponse> {
    return this.apiService.get<AppointmentDetailsResponse>(`Appointments/GetAppointment/${appointmentId}/${en}`);
  }
}
