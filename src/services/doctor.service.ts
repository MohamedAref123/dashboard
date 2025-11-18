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

import { ReviewResponse } from 'src/app/Models/Responses/ReviewResponse';
import { ReviewsRequest } from 'src/app/Models/Requests/ReviewsRequest';
import { DoctorAvialabilitiesModel } from 'src/app/Models/Responses/Current-AvailabilitiesResponse';
import { CreateOfflineAppointmentRequest } from 'src/app/Models/Requests/CreateOfflineAppointmentRequest';
import { GetPatientByPhoneResponse } from 'src/app/Models/Responses/GetPatientByPhoneResponse ';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiService = inject(ApiService);
  private http = inject(HttpClient);
  private uploadUrl = `${environment.attachmentURL}ProfileMedia/Upload`;

  // private readonly uploadUrl = 'http://attachments.hgtechnologygroup.net/api/v1/ProfileMedia/Upload';

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

  reviews(request: ReviewsRequest): Observable<ReviewResponse> {
    return this.apiService.post<ReviewResponse>(`Reviews/doctor`, request);
  }

  getavailabilities(doctorid: string, lang: string): Observable<DoctorAvialabilitiesModel> {
    return this.apiService.get<DoctorAvialabilitiesModel>(`Appointments/doctor/current/availabilities/${doctorid}/${lang}`);
  }

  createOfflineAppointment(payload: CreateOfflineAppointmentRequest): Observable<CreateOfflineAppointmentRequest> {
    return this.apiService.post(`Appointments/CreateOffline`, payload);
  }

  checkPhoneNumber(phone: string): Observable<GetPatientByPhoneResponse> {
    console.log('📤 Sending phone to API:', phone);
    return this.apiService.get<GetPatientByPhoneResponse>(`Patient/GetByPhone/${phone}`);
  }



  uploadDoctorImage(profileId: string, file: File, lang: string = 'en'): Observable<imageResponse> {
    const formData = new FormData();
    formData.append('ProfileId', profileId); // ✅ مثل ما في الـ cURL
    formData.append('Lang', lang);
    formData.append('Image', file);
    formData.append('AttachmentType', '1');

    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Missing authorization token.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<imageResponse>(this.uploadUrl, formData, { headers });
  }
}
