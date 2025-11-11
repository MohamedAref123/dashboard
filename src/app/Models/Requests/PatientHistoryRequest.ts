export interface PatientHistoryCreateRequest {
  patientId: string;
  doctorId: string;
  specialistId: string;
  diagnosis: string;
  notes: string;
  lang: string;
  images?: string[];
}
