import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { TicketStatus } from 'src/app/Models/shared/ticket.model';
import { ticketsRequest } from 'src/app/Models/tickets/tickets-request';
import { TicketItem, Ticketresponse } from 'src/app/Models/tickets/tickets-response';
import { TicketsService } from 'src/services/tickets.service';
import { GenericTable, TableAction } from 'src/app/shared/generic-table/generic-table';
import { TranslateModule } from '@ngx-translate/core';
import { dateRangeValidator } from 'src/app/shared/validation-error/validation-error';
import { DateHelper } from 'src/app/shared/Helpers/DatesHelper';


import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-list-tickets.component',
  imports: [NgFor, NgIf, ReactiveFormsModule, GenericTable, TranslateModule],
  templateUrl: './list-tickets.component.html',
  styleUrl: './list-tickets.component.scss'
})
export class ListTicketsComponent implements OnInit {

  tickets: TicketItem[] = [];
  ticketStatuses = Object.values(TicketStatus)
    .filter(v => typeof v === 'number');

  router = inject(Router);
  route = inject(ActivatedRoute);
  ticketsService = inject(TicketsService);
  dialog = inject(MatDialog);
  patientId: string | null = null;


  fb = inject(FormBuilder);

  filterForm!: FormGroup;
  private dateHelper = inject(DateHelper);

  headers = [
    { key: 'title', label: 'TICKETS.TITLE' },
    { key: 'description', label: 'TICKETS.DESCRIPTION' },
    { key: 'statusText', label: 'TICKETS.STATUS.LABEL' },
    { key: 'typeText', label: 'TICKETS.TYPE.LABEL' },
    { key: 'createdAt', label: 'TICKETS.CREATED_AT', type: 'date' },


  ];


  tableActions: TableAction[] = [
    { icon: 'visibility', label: 'BUTTONS.VIEW', color: 'primary', action: 'view' }
  ];

  pagenation = {
    pageSize: 10,
    pageIndex: 0,
    totalRecords: 0
  };

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('patientId');

    const today = new Date();
    const before30Days = new Date();
    before30Days.setDate(today.getDate() - 30);

    this.filterForm = this.fb.group({
      fromDate: [this.formatDate(before30Days)],
      toDate: [this.formatDate(today)],
      status: [TicketStatus.Open],
    },
      { validators: dateRangeValidator });

    this.loadTickets();
  }


  onPageChange(event: PageEvent) {
    this.pagenation.pageIndex = event.pageIndex;
    this.pagenation.pageSize = event.pageSize;
    this.loadTickets();
  }

  handleAction(event: { row: TicketItem; action: string }) {
    if (event.action === 'view' && event.row.status.toLowerCase() === 'open') {
      this.router.navigate(['/Get-ticket/', event.row.id]);
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().substring(0, 10);
  }



  loadTickets() {
    const { status, fromDate, toDate } = this.filterForm.value;

    const payload: ticketsRequest = {
      status: +status, // رقم من enum
      fromDate: new Date(fromDate).toISOString(),
      toDate: new Date(toDate).toISOString(),
      pageSize: this.pagenation.pageSize,
      pageIndex: this.pagenation.pageIndex
    };

    this.ticketsService.gettickets(payload).subscribe({
      next: (res: Ticketresponse) => {

        this.tickets = (res.items || []).map(item => ({
          ...item,

          statusText: 'TICKETS.STATUS.' + item.status.toUpperCase(),
          typeText: 'TICKETS.TYPE.' + item.type.toUpperCase(),

          createdAt: this.dateHelper.formatDateString(item.createdAt, 'dd/MM/yyyy')

        }));

        this.pagenation.totalRecords = res.totalRecords;
      },
      error: (err) => console.error(err)
    });
  }

  getStatusName(status: number) {
    switch (status) {
      case TicketStatus.Open: return 'Open';
      case TicketStatus.Resolved: return 'Resolved';
      case TicketStatus.Closed: return 'Closed';
      default: return 'Unknown';
    }
  }


  onFilter() {
    this.pagenation.pageIndex = 0; // reset pagination
    this.loadTickets();
  }

  createTicket() {
    if (this.patientId) {
      this.router.navigate(['/create-ticket', this.patientId]);
    } else {
      this.router.navigate(['/create-ticket']);
    }
  }

}
