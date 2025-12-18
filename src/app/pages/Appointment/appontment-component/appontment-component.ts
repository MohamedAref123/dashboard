import { NgForOf, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentSummary } from 'src/app/Models/Responses/AppointmentResponses';
import { AppointmentService } from 'src/services/AppointmentService';
import { GenericTable, TableAction } from "src/app/shared/generic-table/generic-table";
import { AppointmentStatus, JwtPayload } from 'src/app/Models/shared/SharedClasses';
import { DateHelper } from 'src/app/shared/Helpers/DatesHelper';
import { PageEvent } from '@angular/material/paginator';
import { AppointmentSearchRequest } from 'src/app/Models/Requests/appointmentRequest';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AddressesResponse } from 'src/app/Models/Responses/AddressesResponse';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-appontment-component',
  imports: [ReactiveFormsModule, FormsModule, NgIf, GenericTable, NgForOf, TranslateModule],
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
  doctorId: string;
  addresses: AddressesResponse[] = [];
  translate = inject(TranslateService);


  headers = [
    { key: 'patientName', label: 'APPOINTMENT.PATIENT' },
    { key: 'formattedDate', label: 'APPOINTMENT.DATE' },
    { key: 'time', label: 'APPOINTMENT.TIME' },
    { key: 'dayOfWeek', label: 'APPOINTMENT.DAY' },
    { key: 'addressName', label: 'APPOINTMENT.ADDRESS' },
    { key: 'statusText', label: 'APPOINTMENT.STATUS' }
  ];


  tableActions: TableAction[] = [
    { icon: 'visibility', label: 'BUTTONS.VIEW', color: 'primary', action: 'view' },
    { icon: 'visibility', label: 'BUTTONS.HISTORY', color: 'primary', action: 'history' },
    { icon: 'visibility', label: 'view history', color: 'primary', action: 'view-histort' }
  ];

  pagenation = {
    pageSize: 10,
    pageIndex: 0,
    totalRecords: 0
  };
  constructor() {

  }



  ngOnInit(): void {
    const today = new Date();

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    // Create search form
    this.searchForm = this.fb.group({
      fromDate: [formatDate(today)],
      toDate: [formatDate(today)],
      status: [null], // empty = all statuses
      addressId: [null]
    });

    this.translate.onLangChange.subscribe(event => {
      console.log('Language changed to:', event.lang);
      this.searchAppointments();
    });

    // Populate status dropdown
    this.statusOptions = Object.keys(AppointmentStatus).filter(k => isNaN(Number(k)));
    console.log(this.statusOptions); // يجب أن تظهر ["Pending", "Confirmed", "Cancelled", "Completed"]

    this.loadAddresses();
    this.searchAppointments();
  }


  loadAddresses() {
    if (!this.doctorId) {
      const decoded = jwtDecode<JwtPayload>(this.getToken());

      this.doctorId = decoded.LoggedId;
    }
    this.appointmentService.getDoctorAdresses(this.doctorId).subscribe({
      next: (res) => this.addresses = res,
      error: (err) => console.error('Error loading addresses', err)
    });
  }

  searchAppointments(): void {
    this.searchModel = this.searchForm.value as AppointmentSearchRequest;
    this.searchModel.pageIndex = this.pagenation.pageIndex;
    this.searchModel.pageSize = this.pagenation.pageSize;
    this.searchModel.lang = this.translate.currentLang || 'ar';

    // Convert selected status to enum value
    this.searchModel.status = this.searchForm.value.status
      ? AppointmentStatus[this.searchForm.value.status as keyof typeof AppointmentStatus]
      : null;

    this.appointmentService.searchAppointments(this.searchModel).subscribe({
      next: (response) => {
        this.appointments = (response.items || []).map(item => ({
          ...item,
          statusText: 'STATUS.' + AppointmentStatus[item.status].toUpperCase()

          ,
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
    if (event.action === 'history') {
      this.router.navigate(['/patientHistory/', event.row.patientId]);
    }

    if (event.action === 'view-histort') {
      this.router.navigate(['/view-patient-History/', event.row.patientId]);
    }

  }








  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
