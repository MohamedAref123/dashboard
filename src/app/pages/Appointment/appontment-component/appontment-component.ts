import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentSummary, } from 'src/app/Models/Responses/AppointmentResponses';
import { AppointmentService } from 'src/services/AppointmentService';
import { GenericTable, TableAction } from "src/app/shared/generic-table/generic-table";
import { AppointmentStatus } from 'src/app/Models/shared/SharedClasses';


@Component({
  selector: 'app-appontment-component',
  imports: [ReactiveFormsModule, FormsModule, NgIf, GenericTable],
  templateUrl: './appontment-component.html',
  styleUrl: './appontment-component.scss'
})
export class AppontmentComponent implements OnInit {
  searchForm!: FormGroup;
  appointments: AppointmentSummary[] = [];
  totalRecords: number = 0;
  private appointmentService = inject(AppointmentService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  userId: string = '';
  constructor() { }

  headers = [
    { key: 'patientName', label: 'Patient Name' },
    { key: 'appointmentDate', label: 'Appointment Date' },
    { key: 'time', label: 'Time' },
    { key: 'dayOfWeek', label: 'Day' },
    { key: 'addressName', label: 'Address' },

    { key: 'statusText', label: 'Status' }
  ];

  tableActions: TableAction[] = [
    { icon: 'visibility', label: 'View', color: 'primary', action: 'view' },

  ];


  ngOnInit(): void {
    // قراءة userId من الـ URL
    const userId = this.route.snapshot.paramMap.get('userId');
    console.log('User ID from URL:', userId);

    // خزّنه إذا كنت تحتاجه في البحث
    this.userId = userId || '';

    // باقي الكود القديم...
    const today = new Date();

    const from = new Date(today);
    from.setDate(today.getDate() - 15);

    const to = new Date(today);
    to.setDate(today.getDate() + 15);

    const formatDate = (d: Date) =>
      d.toISOString().split('T')[0];

    this.searchForm = this.fb.group({
      fromDate: [formatDate(from)],
      toDate: [formatDate(to)]
    });
  }



  searchAppointments(): void {
    const formValues = this.searchForm.value;

    const payload = {
      pageSize: 10,
      pageIndex: 0,
      appointmentType: 0,
      status: 0,
      userId: this.userId,
      lang: 'en',
      fromDate: formValues.fromDate,
      toDate: formValues.toDate
    };

    this.appointmentService.searchAppointments(payload).subscribe({
      next: (response) => {
        // حول status من رقم إلى نص
        this.appointments = (response.items || []).map(item => ({
          ...item,
          statusText: AppointmentStatus[item.status] ?? 'Unknown'
        }));

        this.totalRecords = response.totalRecords || 0;
        console.log('Appointments after mapping:', this.appointments);
      },
      error: (err) => {
        console.error('Error loading appointments', err);
      }
    });
  }


  handleAction(event: { row: AppointmentSummary; action: string }) {

    if (event.action === 'view') {
      this.router.navigate(['/appointments/view/', event.row.appointmentId]);

    }
  }

}
