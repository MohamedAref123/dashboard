export interface ticketsRequest {
  status: number;
  fromDate: string;
  toDate: string;
  pageSize: number;
  pageIndex: number;
}

export interface SendMessageRequest {
  ticketId: string;
  senderUserId: string;
  message: string;
}
