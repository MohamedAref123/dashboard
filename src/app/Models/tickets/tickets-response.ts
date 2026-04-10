export interface Ticketresponse {
  pageSize: number;
  pageIndex: number;
  totalRecords: number;
  items: TicketItem[];
}

export interface TicketItem {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  createdByUserId: string;
  targetUserId: string;
  createdAt: string;
}
