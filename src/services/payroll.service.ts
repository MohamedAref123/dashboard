import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PayrollRequest } from 'src/app/Models/Requests/PayrollRequest';
import { PayrollResponse } from 'src/app/Models/Responses/PayrollResponse';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  http = inject(HttpClient);
  private apiUrl = `${environment.baseurl}/v1/Payroll/DoctorAppointments`;


  getDoctorAppointments(body: PayrollRequest): Observable<PayrollResponse> {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Missing authorization token.');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post<PayrollResponse>(this.apiUrl, body, { headers });
  }
}
