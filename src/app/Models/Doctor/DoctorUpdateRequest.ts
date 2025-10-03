export interface DoctorUpdateRequest {
  doctorId: string;
  appUserId: string;
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
  gender : string;
}
