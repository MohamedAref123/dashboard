import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './Api.service';
import { updateusbuserRequest } from 'src/app/Models/Requests/update-subuserRequest';
import { DoctorSubUsersResponse, SubuserResponse } from 'src/app/Models/Responses/SubuserResponse';
import { updatesubuserResponse } from 'src/app/Models/Responses/update-subuserResponse';

@Injectable({
  providedIn: 'root'
})
export class SubuserService {
  apiservice = inject(ApiService)
  constructor() { }



  subuserList(doctorId: string, lang: string): Observable<DoctorSubUsersResponse> {
    return this.apiservice.get<DoctorSubUsersResponse>(`Accounts/Sub/byDoctor/${doctorId}/${lang}`);
  }

  updateusbuser(modal: updateusbuserRequest): Observable<updatesubuserResponse> {
    return this.apiservice.post<updatesubuserResponse>('Accounts/Sub/Update', modal)
  }

  getsubuser(subId: string): Observable<SubuserResponse> {
    return this.apiservice.get<SubuserResponse>(`Accounts/Sub/GetUser/${subId}`)
  }
}
