import { AppointmentCategory } from "../shared/SharedClasses";

export interface PayrollResponse {
  totalPayroll: number;
  pageSize: number;
  pageIndex: number;
  totalRecords: number;
  items: PayrollItem[];
}
export interface PayrollItem {
  patientName: string;
  category: AppointmentCategory;
  price: number | null;
  appointmentDate: string; // ISO Date
}
