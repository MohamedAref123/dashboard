import { AppointmentStatus } from '../shared/SharedClasses';

export class AppointmentDetailsResponse {
  doctorId: string;
  patientId: string;
  patientName: string;
  appointmentDate: Date;
  fromTime: string;
  toTime: string;
  notes: string;
  dayOfWeek: string;
  addressName: string;
  status: AppointmentStatus;
}

export interface SearchAppointmentsResponse {
  pageSize: number;
  pageIndex: number;
  totalRecords: number;
  items: AppointmentSummary[];
}


export interface AppointmentSummary {
  appointmentId: string;
  patientName: string;
  time: string;
  appointmentDate: Date;
  dayOfWeek: string;
  addressName: string;
  appointmentType: number;
  status: AppointmentStatus;
}
export { AppointmentStatus };

