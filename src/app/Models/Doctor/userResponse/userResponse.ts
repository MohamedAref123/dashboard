export interface userResponse {
  doctorId: string,
  doctorSpecialistId: string,
  doctorSpecialist: string,
  doctorNameEN: string,
  doctorNameAR: string,
  normalizedName: string,
  descriptionAR: string,
  descriptionEN: string,
  image: string,
  licenseNumber: string,
  education: string,
  yearsOfExperience: number,
  email: string,
  gender: string,
  price: number,

  phoneNumber: string,
  isActive: boolean,

  addresses: addresses[]
}

export interface addresses {
  country: string,
  city: string,
  region: string,
  postalCode: string,
  street: string,
  buildingNumber: string,
  phoneNumber: string,
  addressName: string,
  longitude: 0,
  latitude: 0,
  addressId: string,
  doctorId: string,
  isDeleted: true,
  availabilities: availabilities[]
}
export interface availabilities {
  doctorAvailabilityId: string,
  addressId: string,
  isDeleted: true,
  dayOfWeek: 0,
  startTime: string,
  endTime: string
}



