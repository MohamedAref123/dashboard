import { inject, Injectable } from '@angular/core';
import { ApiService } from './Api.service';
import { SendMessageRequest, ticketsRequest } from 'src/app/Models/tickets/tickets-request';
import { TicketDetails, TicketMessage, Ticketresponse } from 'src/app/Models/tickets/tickets-response';
import { CreateTicketRequest } from 'src/app/Models/tickets/create-tickets-request';
import { createticketsResponse } from 'src/app/Models/tickets/create-tickets-response';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor() { }
  private apiservice = inject(ApiService);

  gettickets(ticketsRequest: ticketsRequest): Observable<Ticketresponse> {
    return this.apiservice.post<Ticketresponse>('Ticket/GetTickets', ticketsRequest);
  }

  createTicket(request: CreateTicketRequest): Observable<createticketsResponse> {
    return this.apiservice.post<createticketsResponse>('Ticket/Create', request);
  }

  getTicketById(ticketId: string): Observable<TicketDetails> {
    return this.apiservice.get<TicketDetails>(`Ticket/GetTicket/${ticketId}`);
  }

  sendMessage(body: SendMessageRequest): Observable<void> {
    return this.apiservice.post<void>(`Ticket/AddMessage`, body);
  }

  getMessages(ticketId: string) {
    return this.apiservice.get<TicketMessage[]>(`Ticket/GetMessages/${ticketId}`);
  }


}
