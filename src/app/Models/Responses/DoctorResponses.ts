export class DoctorSearchResponse {
  pageSize: number;
  pageIndex: number;
  totalRecords: number;
  items: DoctorResponse[];
}

export class DoctorResponse {
  doctorId: string;
  doctorName: string;
  price: number;
  description: string;
}

export interface DoctorDetailsResponse {
  doctorId: string;
  gender: string;
  doctorSpecialistId: string;
  price: number;
  doctorNameEN: string;
  doctorNameAR: string;
  phoneNumber: string;
  descriptionAR: string;
  descriptionEN: string;
  email: string;
  licenseNumber: string;
  education: string;
  yearsOfExperience: number;
  addresses?: AddressResponse[];
}

export interface AddressResponse {
  addressName:string
  addressId: string;
  doctorId: string;
  country: string;
  city: string;
  region: string;
  postalCode: string;
  street: string;
  buildingNumber: string;
  phoneNumber: string;
  longitude: number;
  latitude: number;
  isDeleted: boolean;
  availabilities?: AvailabilityResponse[];
}

export interface AvailabilityResponse {
  doctorAvailabilityId: string;
  addressId: string;
  isDeleted: boolean;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

