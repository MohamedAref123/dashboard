export interface ReviewResponse {
  pageSize: number;
  pageIndex: number;
  totalRecords: number;
  items: ReviewItem[];
  totalRating: number;
  canRate: boolean;
}


export interface ReviewItem {
  reviewId: string;
  patientName: string;
  doctorId: string;
  rating: number;
  comment: string;
}


export interface PageChangeEvent {
  pageIndex: number;
  pageSize: number;
}
