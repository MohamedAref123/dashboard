import { NgForOf, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentSummary } from 'src/app/Models/Responses/AppointmentResponses';
import { AppointmentService } from 'src/services/AppointmentService';
import { GenericTable, TableAction } from "src/app/shared/generic-table/generic-table";
import { AppointmentStatus } from 'src/app/Models/shared/SharedClasses';
import { DateHelper } from 'src/app/shared/Helpers/DatesHelper';
import { PageEvent } from '@angular/material/paginator';
import { AppointmentSearchRequest } from 'src/app/Models/Requests/appointmentRequest';

@Component({
  selector: 'app-appontment-component',
  imports: [ReactiveFormsModule, FormsModule, NgIf, GenericTable, NgForOf],
  templateUrl: './appontment-component.html',
  styleUrl: './appontment-component.scss'
})
export class AppontmentComponent implements OnInit {
  searchForm!: FormGroup;
  appointments: AppointmentSummary[] = [];
  statusOptions: string[] = [];

  private appointmentService = inject(AppointmentService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  userId: string = '';
  private dateHelper = inject(DateHelper);
  searchModel!: AppointmentSearchRequest;

  headers = [
    { key: 'patientName', label: 'Patient' },
    { key: 'formattedDate', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'dayOfWeek', label: 'Day' },
    { key: 'addressName', label: 'Address' },
    { key: 'statusText', label: 'Status' }
  ];

  tableActions: TableAction[] = [
    { icon: 'visibility', label: 'View', color: 'primary', action: 'view' }
  ];

  pagenation = {
    pageSize: 10,
    pageIndex: 0,
    totalRecords: 0
  };

  constructor() { }

  ngOnInit(): void {
    const today = new Date();

    const from = new Date(today);
    from.setDate(today.getDate() - 15);

    const to = new Date(today);
    to.setDate(today.getDate() + 15);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    // Create search form
    this.searchForm = this.fb.group({
      fromDate: [formatDate(from)],
      toDate: [formatDate(to)],
      status: ['Pending'] // empty = all statuses
    });

    // Populate status dropdown
    this.statusOptions = Object.keys(AppointmentStatus).filter(key => isNaN(Number(key)));

    this.searchAppointments();
  }

  searchAppointments(): void {
    this.searchModel = this.searchForm.value as AppointmentSearchRequest;
    this.searchModel.pageIndex = this.pagenation.pageIndex;
    this.searchModel.pageSize = this.pagenation.pageSize;
    this.searchModel.lang = 'en';

    // Convert selected status to enum value
    this.searchModel.status = this.searchForm.value.status
      ? AppointmentStatus[this.searchForm.value.status as keyof typeof AppointmentStatus]
      : 0;

    this.appointmentService.searchAppointments(this.searchModel).subscribe({
      next: (response) => {
        this.appointments = (response.items || []).map(item => ({
          ...item,
          statusText: AppointmentStatus[item.status] ?? 'Unknown',
          formattedDate: this.dateHelper.formatDateString(item.appointmentDate, 'dd-MM-yyyy'),
        }));

        this.pagenation.totalRecords = response.totalRecords || 0;
      },
      error: (err) => console.error('Error loading appointments', err)
    });
  }

  onPageChange(event: PageEvent) {
    this.pagenation.pageIndex = event.pageIndex;
    this.pagenation.pageSize = event.pageSize;
    this.searchAppointments();
  }

  handleAction(event: { row: AppointmentSummary; action: string }) {
    if (event.action === 'view') {
      this.router.navigate(['/appointments/view/', event.row.appointmentId]);
    }
  }
}
