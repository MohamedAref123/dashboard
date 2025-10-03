export interface AvailabilityRequest {

  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface AddressRequest {
  addressName: string;
  country: string;
  city: string;
  region: string;
  postalCode: string;
  street: string;
  longitude: number;
  latitude: number;
  buildingNumber: string;
  phoneNumber: string;
  availabilities: AvailabilityRequest[];
}

export interface DoctorCreateRequest {

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
  addresses: AddressRequest[];
}
