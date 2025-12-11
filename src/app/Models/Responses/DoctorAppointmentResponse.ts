export interface DoctorAppointmentResponse {
  addressName: string;
  details: DoctorAvailabilityDetail[];
  groupedItems?: Record<string, GroupedAppointment[]>;
}

export interface DoctorAvailabilityDetail {
  doctorAvailabilityId: string;
  dayOfWeek: string;
  appointmentDate: Date[];
}

export interface GroupedAppointment {
  appointmentDate: Date;
  doctorAvailabilityId: string; // ضروري لإرسال الطلب
}

