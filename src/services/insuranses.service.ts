import { inject, Injectable } from '@angular/core';
import { ApiService } from './Api.service';
import { InsurancesResponse } from 'src/app/Models/Responses/insurancesResponse';

@Injectable({
  providedIn: 'root'
})
export class InsuransesService {
  private apiService = inject(ApiService);

  public getInsurances(lang: string = 'en') {
    return this.apiService.get<InsurancesResponse[]>(`DoctorInsurance/Insurances/${lang}`);
  }
}
