export interface Availability {
  doctorAvailabilityId: string;
  addressId: string;
  isDeleted: boolean;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateAddressRequest {
  addressId: string;
  doctorId: string;
  addressName: string;
  country: string;
  city: string;
  region: string;
  postalCode: string;
  street: string;
  buildingNumber: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  availabilities?: Availability[];

}

