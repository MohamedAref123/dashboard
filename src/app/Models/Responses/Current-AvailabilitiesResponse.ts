import { InsurancesResponse } from "./insurancesResponse";

export interface DoctorAvialabilitiesModel {
  doctorName: string;
  doctorSpecialist: string;
  licenseNumber: string;
  education: string;
  yearsOfExperience: number;
  description: string;
  gender: string;
  insurance: InsurancesResponse;
  availableAppointments: AvailableAppointment[];
}

export interface AvailableAppointment {
  country: string;
  cityId: string; // UUID
  regionId: string; // UUID
  city: string;
  region: string;
  postalCode: string;
  street: string;
  buildingNumber: string;
  phoneNumber: string;
  addressName: string;
  googleLocation: string;
  doctorAvailableTimes: DoctorAvailableTime[];
}

export interface DoctorAvailableTime {
  doctorAvailabilityId: string; // UUID
  dayOfWeek: string;
  time: string;
  appointmentDate: string; // ISO date string
}
