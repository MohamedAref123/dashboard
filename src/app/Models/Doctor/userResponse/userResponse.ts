import { InsurancesResponse } from "../../Responses/insurancesResponse";
import { AppointmentCategory } from "../../shared/SharedClasses";

export interface userResponse {

  insurance: InsurancesResponse;
  doctorId: string;
  doctorSpecialistId: string;
  doctorSpecialist: string;
  doctorNameEN: string;
  doctorNameAR: string;
  normalizedName: string;
  descriptionAR: string;
  descriptionEN: string;
  profileImagePath: string;
  image: string,
  licenseNumber: string;
  education: string;
  yearsOfExperience: number;
  email: string;
  gender: string;
  examinationPrice: number;
  consultationPrice: number | null;
  phoneNumber: string;
  isActive: boolean;
  addresses: DoctorAddress[];
}

export interface DoctorAddress {

  googleLocation: string;
  country: string;
  city: string;
  cityId: string;
  regionId: string;
  region: string;
  postalCode: string;
  street: string;
  buildingNumber: string;
  phoneNumber: string;
  addressName: string;
  addressId: string;
  doctorId: string;
  isDeleted: true;
  availabilities: availabilities[];
}
export interface availabilities {
  doctorAvailabilityId: string;
  addressId: string;
  isDeleted: true;
  dayOfWeek: 0;
  startTime: string;
  endTime: string;
  slotTime: number;
  category: AppointmentCategory[];
}
