import { inject, Injectable } from '@angular/core';
import { ApiService } from './Api.service';
import { Observable } from 'rxjs';
import { AppointmentDetailsResponse, SearchAppointmentsResponse } from 'src/app/Models/Responses/AppointmentResponses';
import { AppointmentSearchRequest } from 'src/app/Models/Requests/appointmentRequest';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiService = inject(ApiService);

  getAppointment(appointmentId: string, en: 'EN' | 'AR'): Observable<AppointmentDetailsResponse> {
    return this.apiService.get<AppointmentDetailsResponse>(`Appointments/GetAppointment/${appointmentId}/${en}`);
  }

  searchAppointments(payload: AppointmentSearchRequest): Observable<SearchAppointmentsResponse> {
    return this.apiService.post<SearchAppointmentsResponse>(`Appointments/SearchDoctorAppointments`, payload);
  }


  updateAppointmentStatus(appointmentId: string, status: number): Observable<void> {
    return this.apiService.post<void>(`Appointments/ChangeAppointmentStatus/`, { appointmentId, status });
  }
}
