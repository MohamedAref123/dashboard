export interface PatientHistoryResponse {
  patientHistoryId: string;
  patientId: string;
  doctorId: string;
  specialistId: string;
  doctorName: string;
  specialistName: string;
  diagnosis: string;
  notes: string;
  createdAt: string; // ISO date string
  paths: string;
}
