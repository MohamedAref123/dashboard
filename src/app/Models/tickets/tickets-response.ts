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

export interface TicketDetails {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  createdByUserId: string;
  targetUserId: string;
  createdAt: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  isSeen: boolean;
  senderUserId: string;
  message: string;
  createdAt: string;
  isMine: boolean;
}
