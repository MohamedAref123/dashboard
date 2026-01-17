export interface AvailabilityRequest {

  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface AddressRequest {
  addressName: string;
  country: string;

  cityId: string;
  regionId: string;

  postalCode: string;
  street: string;
  googleLocation: string;

  buildingNumber: string;
  phoneNumber: string;

  availabilities: AvailabilityRequest[];

  doctorId: string;
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
