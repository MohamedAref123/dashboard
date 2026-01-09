export interface SubuserResponse {

  parentDoctorId: string;
  id: string;
  isDeleted: boolean;
  userName: string;
  customName: string;
  email: string;
  doctorId: string;
  isNew: boolean;
}

export interface DoctorSubUsersResponse {
  doctorName: string;
  subUsers: SubuserResponse[];
}
