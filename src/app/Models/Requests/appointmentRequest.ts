export interface AppointmentSearchRequest {
  pageSize: number;
  pageIndex: number;
  appointmentType: number;
  totalRecords: number;
  status: number;
  userId: string;
  lang: string;
  fromDate?: string;
  toDate?: string;
}

