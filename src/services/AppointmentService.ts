import { inject, Injectable } from '@angular/core';
import { ApiService } from './Api.service';
import { map, Observable } from 'rxjs';
import { AppointmentDetailsResponse, SearchAppointmentsResponse } from 'src/app/Models/Responses/AppointmentResponses';
import { AppointmentSearchRequest } from 'src/app/Models/Requests/appointmentRequest';
import { AddressesResponse } from 'src/app/Models/Responses/AddressesResponse';
import { HttpClient } from '@angular/common/http';
import { CancelDayRequest } from 'src/app/Models/Requests/CancelDayRequest';
import { DoctorAppointmentResponse } from 'src/app/Models/Responses/DoctorAppointmentResponse';
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




  canceDoctorAllDay(payload: CancelDayRequest): Observable<void> {
    return this.apiService.post<void>(
      `Appointments/CancelDoctorAllDay`,
      payload
    );
  }


  getDoctorAppointment(): Observable<DoctorAppointmentResponse[]> {
    return this.apiService
      .get<DoctorAppointmentResponse[]>('DoctorAdresses/GetDoctorAvailableDays')
      .pipe(
        map(response =>
          response.map(item => ({
            ...item,
            details: item.details.map(detail => ({
              ...detail,
              appointmentDate: detail.appointmentDate.map(d => new Date(d))
            }))
          }))
        )
      );
  }


}
