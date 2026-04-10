export interface CreateTicketRequest {
  title: string;
  description: string;
  type: number;
  createdByUserId: string;
  targetPersonId: string;
}
