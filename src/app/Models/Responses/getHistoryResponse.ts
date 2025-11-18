export interface GetPatientHistoryResponse {
  pageSize: number;
  pageIndex: number;
  totalRecords: number;
  items: PatientHistoryItem[];
  patientName: string;
  chronicDiseases: string;
  medicines: string;
  surgeries: string;
  bloodType: string;
  birthday: string; // أو Date إذا تحب التعامل معها كتاريخ

}

export interface PatientHistoryItem {
  patientHistoryId: string;
  patientId: string;
  doctorId: string;
  specialistId: string;
  doctorName: string;
  specialistName: string;
  diagnosis: string;
  notes: string;
  createdAt: string; // أو Date
  paths: string;
  showImages?: boolean;

}
