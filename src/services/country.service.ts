import { inject, Injectable } from '@angular/core';
import { ApiService } from './Api.service';
import { cityResponse } from 'src/app/Models/Responses/CityResponse';
import { RegionResponse } from 'src/app/Models/Responses/RegionResponse';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  apiService = inject(ApiService);
  getCountries(lang: string, country: string) {

    return this.apiService.get<cityResponse[]>(`Countries/Cities/${lang}/${country}`);
  }

  getRegions(lang: string, cityId: string) {

    return this.apiService.get<RegionResponse[]>(`Countries/Regions/${lang}/${cityId}`);
  }
}
