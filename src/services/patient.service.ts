import { inject, Injectable } from '@angular/core';
import { ApiService } from './Api.service';


import { HttpClient, HttpHeaders } from '@angular/common/http'; // ✅ الصحيح


import { PatientHistoryCreateRequest } from 'src/app/Models/Requests/PatientHistoryRequest';
import { environment } from 'src/environments/environment';
import { PatientHistoryResponse } from 'src/app/Models/Responses/PatientHistoryResponse ';
import { Observable } from 'rxjs';
import { GetPatientHistoryResponse } from 'src/app/Models/Responses/getHistoryResponse';


@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiService = inject(ApiService);
  http = inject(HttpClient)
  private uploadUrl = `${environment.attachmentURL}PatientHistory/Create`;

  createPatientHistory(req: PatientHistoryCreateRequest) {
    return this.apiService.post<PatientHistoryResponse>(`${environment.attachmentURL}PatientHistory/Create`, req);
  }



  getPatientHistory(
    patientId: string,
    specialistId: string,
    pageIndex = 0,
    pageSize = 10,
    lang = 'en'
  ): Observable<GetPatientHistoryResponse> {
    const body = { patientId, specialistId, pageSize, pageIndex, lang };

    const token = localStorage.getItem('access_token') || '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<GetPatientHistoryResponse>(
      `${environment.attachmentURL}PatientHistory/GetPatientHistory`,
      body,
      { headers }
    );
  }

  getpatientHistoryByphone(phoneNumber: string, pageIndex = 0, pageSize = 10): Observable<GetPatientHistoryResponse> {

    const token = localStorage.getItem('access_token') || '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,

    });

    return this.http.post<GetPatientHistoryResponse>(
      `${environment.attachmentURL}PatientHistory/GetPatientHistoryByPhoneNumber`,
      { phoneNumber, pageIndex, pageSize },
      { headers }
    );
  }

  createPatientHistoryWithImages(
    patientId: string,
    doctorId: string,
    specialistId: string,
    diagnosis: string,
    notes: string,
    lang: string,
    files: File[]
  ): Observable<PatientHistoryResponse> {
    const formData = new FormData();

    formData.append('PatientId', patientId);
    formData.append('DoctorId', doctorId);
    formData.append('SpecialistId', specialistId);
    formData.append('Diagnosis', diagnosis);
    formData.append('Notes', notes);
    formData.append('Lang', lang);

    // لو عندك أكتر من صورة
    files.forEach(file => formData.append('Images', file, file.name));

    const token = localStorage.getItem('access_token') || '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      // لا تحط Content-Type لأن Angular يحطها تلقائيًا مع FormData
    });

    return this.http.post<PatientHistoryResponse>(this.uploadUrl, formData, { headers });
  }

}
