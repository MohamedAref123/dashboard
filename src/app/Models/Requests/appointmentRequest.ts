export interface AppointmentRequest {
  pageSize: number;
  pageIndex: number;
  appointmentType: number;
  status: number;
  userId: string;
  lang: string;
  fromDate?: string;
  toDate?: string;
}

