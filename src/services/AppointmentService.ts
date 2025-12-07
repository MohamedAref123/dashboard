import { inject, Injectable } from '@angular/core';
import { ApiService } from './Api.service';
import { Observable } from 'rxjs';
import { AppointmentDetailsResponse, SearchAppointmentsResponse } from 'src/app/Models/Responses/AppointmentResponses';
import { AppointmentSearchRequest } from 'src/app/Models/Requests/appointmentRequest';
import { AddressesResponse } from 'src/app/Models/Responses/AddressesResponse';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiService = inject(ApiService);
  private http = inject(HttpClient);

  getAppointment(appointmentId: string, en: 'EN' | 'AR'): Observable<AppointmentDetailsResponse> {
    return this.apiService.get<AppointmentDetailsResponse>(`Appointments/GetAppointment/${appointmentId}/${en}`);
  }

  searchAppointments(payload: AppointmentSearchRequest): Observable<SearchAppointmentsResponse> {
    return this.apiService.post<SearchAppointmentsResponse>(`Appointments/SearchDoctorAppointments`, payload);
  }


  updateAppointmentStatus(appointmentId: string, status: number): Observable<void> {
    return this.apiService.post<void>(`Appointments/ChangeAppointmentStatus/`, { appointmentId, status });
  }

  getDoctorAdresses(doctorID: string): Observable<AddressesResponse[]> {
    return this.apiService.get<AddressesResponse[]>(`DoctorAdresses/GetAddresses/${doctorID}`)
  }




  canceDoctorAllDay(day: Date) {
    const isoDate = day.toISOString().split('.')[0] + 'Z'; // optional trim ms
    return this.apiService.get<void>(
      `Appointments/CancelDoctorAllDay/${encodeURIComponent(isoDate)}`
    );
  }

}
