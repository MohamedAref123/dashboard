export interface CreateOfflineAppointmentRequest {
  doctorId: string;
  doctorAvailabilityId: string;
  appointmentDate: string; // ISO format (e.g., 2025-11-03T14:04:23.697Z)
  fromTime: string;
  notes: string;
  userId: string;
  status: number; // 0 = Pending, 1 = Confirmed, 2 = Cancelled (مثلاً)
  appointmentType: number; // 0 = Offline, 1 = Online
  phoneNumber: string;
  fullName: string;
}
