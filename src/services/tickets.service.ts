import { inject, Injectable } from '@angular/core';
import { ApiService } from './Api.service';
import { ticketsRequest } from 'src/app/Models/tickets/tickets-request';
import { Ticketresponse } from 'src/app/Models/tickets/tickets-response';
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


}
