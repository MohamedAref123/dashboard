export interface PayrollRequest {
  pageSize: number;
  pageIndex: number;
  fromDate: Date; // ISO Date string
  toDate: Date;   // ISO Date string
}
