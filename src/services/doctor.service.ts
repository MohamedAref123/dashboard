import { inject, Injectable } from '@angular/core';
import { ApiService } from './Api.service';
import { Observable } from 'rxjs';
import { userResponse } from 'src/app/Models/Doctor/userResponse/userResponse';

// import { DoctorCreateRequest } from 'src/app/Models/Doctor/DoctorCreateRequest';
// import { Observable } from 'rxjs';
import { AddressResponse, DoctorDetailsResponse } from 'src/app/Models/Responses/DoctorResponses';
// import { DoctorUpdateRequest } from 'src/app/Models/Doctor/DoctorUpdateRequest';
// import { UpdateAddressRequest } from 'src/app/Models/Doctor/AddressUpdateRequest';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiService = inject(ApiService);

  // public createDoctor(request: DoctorCreateRequest): Observable<void> {
  //   return this.apiService.post<void>('Doctors/Create', request);
  // }

  // searchDoctors(payload: unknown): Observable<DoctorSearchResponse> {
  //   return this.apiService.post<DoctorSearchResponse>(`Doctors/Search`, payload);
  // }

  getDoctorById(id: string, lang: string = 'en'): Observable<DoctorDetailsResponse> {
    return this.apiService.get<DoctorDetailsResponse>(`Doctors/Get/${id}/${lang}`);
  }

  // updateDoctor(payload: DoctorUpdateRequest) {
  //   return this.apiService.post<void>(`Doctors/Update`, payload);
  // }

  getAddressById(addressId: string): Observable<AddressResponse> {
    // لو الـ API بتاعك query parameter:
    return this.apiService.get<AddressResponse>(`DoctorAdresses/Get?addressId=${addressId}`);

    //   // أو لو backend بيقبل path param:
    //   // return this.apiService.get<Address>(`DoctorAdresses/Get/${addressId}`);
  }

  // getAddressesByDoctorId(doctorId: string) {
  //   return this.apiService.get<UpdateAddressRequest[]>(`DoctorAdresses/GetAll/${doctorId}`);
  // }

  // getAddressesByaddressId(addressId: string) {
  //   return this.apiService.get<UpdateAddressRequest>(`DoctorAdresses/Get/${addressId}`);
  // }

  // // ✅ Update address
  // updateAddress(address: UpdateAddressRequest) {
  //   return this.apiService.post(`DoctorAdresses/Update`, address);
  // }

  getuser(en: 'EN' | 'AR'): Observable<userResponse> {
    return this.apiService.get<userResponse>(`Doctors/GetCurrentDoctor/${en}`);
  }
}
