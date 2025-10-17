import { inject, Injectable } from '@angular/core';
import { ApiService } from './Api.service';
import { Observable } from 'rxjs';
import { AppointmentDetailsResponse, SearchAppointmentsResponse } from 'src/app/Models/Responses/AppointmentResponses';
import { AppointmentRequest } from 'src/app/Models/Requests/appointmentRequest';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiService = inject(ApiService);

  getAppointment(appointmentId: string, en: 'EN' | 'AR'): Observable<AppointmentDetailsResponse> {
    return this.apiService.get<AppointmentDetailsResponse>(`Appointments/GetAppointment/${appointmentId}/${en}`);
  }

  searchAppointments(payload: AppointmentRequest): Observable<SearchAppointmentsResponse> {
    return this.apiService.post<SearchAppointmentsResponse>(`Appointments/SearchDoctorAppointments`, payload);
  }

}
