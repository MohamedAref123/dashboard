
import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TicketType } from 'src/app/Models/shared/ticket.model';
import { CreateTicketRequest } from 'src/app/Models/tickets/create-tickets-request';
import { ValidationError } from "src/app/shared/validation-error/validation-error";
import { TicketsService } from 'src/services/tickets.service';
import { ToastService } from 'src/services/ToastService';
@Component({
  selector: 'app-create-tickets.component',
  imports: [ReactiveFormsModule, NgIf, ValidationError, TranslateModule],
  templateUrl: './create-tickets.component.html',
  styleUrl: './create-tickets.component.scss'
})
export class CreateTicketsComponent implements OnInit {


  ticketForm!: FormGroup;
  ticketTypes = Object.values(TicketType).filter(v => typeof v === 'number');
  fb = inject(FormBuilder);
  toast = inject(ToastService)
  route = inject(ActivatedRoute);
  ticketservice = inject(TicketsService);
  translate = inject(TranslateService);
  patientId: string | null = null;


  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('patientId');

    this.ticketForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: [
        this.patientId ? TicketType.ToPatient : TicketType.ToAdmin,
        Validators.required
      ],
      targetPersonId: [this.patientId],
      createdByUserId: ['']
    });


    console.log('PatientTicketComponent initialized', this.patientId);
  }


  submit() {
    if (this.ticketForm.invalid) return;

    const ticket: CreateTicketRequest = this.ticketForm.value;

    this.ticketservice.createTicket(ticket).subscribe({
      next: (res) => {
        this.toast.show(this.translate.instant('TICKETS.CREATED_SUCCESS'));
        console.log('Ticket created successfully', res);
      },
      error: (err) => {
        this.toast.error(this.translate.instant('TICKETS.CREATED_ERROR'));
        console.error('Error creating ticket', err);
      }
    });
    console.log(ticket);
    this.ticketForm.reset();
  }
}
