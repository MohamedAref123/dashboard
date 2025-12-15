import { AppointmentCategory } from "../shared/SharedClasses";

export interface Availability {
  doctorAvailabilityId: string;
  addressId: string;
  isDeleted: boolean;
  dayOfWeek: number;
  startTime: string;
  endTime: string;

  category: AppointmentCategory;
}

export interface UpdateAddressRequest {
  googleLocation: string
  addressId: string;
  doctorId: string;
  addressName: string;
  country: string;
  city: string;
  cityId: string,
  regionId: string,
  isDeleted: boolean,
  region: string;
  postalCode: string;
  street: string;
  buildingNumber: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  categoryType: AppointmentCategory[];
  availabilities?: Availability[];

}

