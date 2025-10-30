import { inject, Injectable } from '@angular/core';
import { ApiService } from './Api.service';
import { Observable } from 'rxjs';
import { userResponse } from 'src/app/Models/Doctor/userResponse/userResponse';

// import { DoctorCreateRequest } from 'src/app/Models/Doctor/DoctorCreateRequest';
// import { Observable } from 'rxjs';
import { AddressResponse, DoctorDetailsResponse } from 'src/app/Models/Responses/DoctorResponses';
import { DoctorUpdateRequest } from 'src/app/Models/Doctor/DoctorUpdateRequest';
import { UpdateAddressRequest } from 'src/app/Models/Doctor/AddressUpdateRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { imageResponse } from 'src/app/Models/Responses/ImageResponse';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiService = inject(ApiService);
  private http = inject(HttpClient)
  private readonly uploadUrl = 'http://attachments.hgtechnologygroup.net/api/v1/ProfileMedia/Upload';

  // public createDoctor(request: DoctorCreateRequest): Observable<void> {
  //   return this.apiService.post<void>('Doctors/Create', request);
  // }

  // searchDoctors(payload: unknown): Observable<DoctorSearchResponse> {
  //   return this.apiService.post<DoctorSearchResponse>(`Doctors/Search`, payload);
  // }

  getDoctorById(id: string, lang: string = 'en'): Observable<DoctorDetailsResponse> {
    return this.apiService.get<DoctorDetailsResponse>(`Doctors/Get/${id}/${lang}`);
  }

  updateDoctor(payload: DoctorUpdateRequest) {
    return this.apiService.post<void>(`Doctors/UpdateCurrent`, payload);
  }

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
  updateAddress(address: UpdateAddressRequest) {
    return this.apiService.post(`DoctorAdresses/Update`, address);
  }

  getuser(en: 'EN' | 'AR'): Observable<userResponse> {
    return this.apiService.get<userResponse>(`Doctors/GetCurrentDoctor/${en}`);
  }



  uploadDoctorImage(
    profileId: string,
    file: File,
    lang: string = 'en'
  ): Observable<imageResponse> {
    const formData = new FormData();
    formData.append('ProfileId', profileId); // ✅ مثل ما في الـ cURL
    formData.append('Lang', lang);
    formData.append('Image', file);

    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Missing authorization token.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<imageResponse>(
      this.uploadUrl,
      formData,
      { headers }
    );
  }



}
