// src/app/core/services/auth.service.ts
import { inject, Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';
import { ApiService } from './Api.service';
import { DoctorSpecialistResponse } from 'src/app/Models/Responses/DoctorSpecialistResponses';
import { DoctorSpecialistCreateRequest, DoctorSpecialistUpdateRequest } from 'src/app/Models/Requests/DoctorSpecialistRequests';




@Injectable({
  providedIn: 'root',
})
export class DoctorSpecialistService {


  constructor() {}

  private apiService=inject(ApiService)


  public GetActive(): Observable<DoctorSpecialistResponse[]> {
    return this.apiService.get<DoctorSpecialistResponse[]>(`DoctorSpecialist/GetActive`).pipe(
      tap(response => {
      return response;
      })
    );
  }
    public GetAll(): Observable<DoctorSpecialistResponse[]> {
    return this.apiService.get<DoctorSpecialistResponse[]>(`DoctorSpecialist/GetAll`).pipe(
      tap(response => {
      return response;
      })
    );
  }

public Create(model : DoctorSpecialistCreateRequest):Observable<DoctorSpecialistResponse>
{
  return this.apiService.post<DoctorSpecialistResponse>(`DoctorSpecialist/Create`,model).pipe(
    tap(response=>
    {
      return response;
    }))
}

public Delete(doctorSpecialistId: string): Observable<void> {
  return this.apiService.delete<void>(`DoctorSpecialist/Delete/${doctorSpecialistId}`);
  // If your API is RESTful: return this.apiService.delete<void>(`DoctorSpecialist/${doctorSpecialistId}`);
}



public Update(model: DoctorSpecialistUpdateRequest): Observable<DoctorSpecialistResponse> {
  return this.apiService.post<DoctorSpecialistResponse>(`DoctorSpecialist/Update`, model);
}

// DoctorSpecialistService.ts
public GetById(specialistId: string): Observable<DoctorSpecialistResponse> {
  return this.apiService.get<DoctorSpecialistResponse>(`DoctorSpecialist/Get/${specialistId}`);
}



}
