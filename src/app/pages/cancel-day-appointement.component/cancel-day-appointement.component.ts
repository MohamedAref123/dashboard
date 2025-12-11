import { CommonModule, DatePipe, formatDate, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CancelDayRequest } from 'src/app/Models/Requests/CancelDayRequest';
import { DoctorAppointmentResponse, DoctorAvailabilityDetail, GroupedAppointment } from 'src/app/Models/Responses/DoctorAppointmentResponse';
import { AppointmentService } from 'src/services/AppointmentService';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cancel-day-appointement.component',
  imports: [DatePipe, NgFor, CommonModule],
  templateUrl: './cancel-day-appointement.component.html',
  styleUrl: './cancel-day-appointement.component.scss'
})
export class CancelDayAppointementComponent implements OnInit {

  appointmentService = inject(AppointmentService);
  appointments: DoctorAppointmentResponse[] = [];
  openedOuterIndex: number | null = null;
  openedInnerIndex: { [key: number]: number | null } = {};
  selectedTime: GroupedAppointment | null = null;

  translate = inject(TranslateService);

  constructor() { }

  ngOnInit(): void {
    this.loadAppointments();
  }


  loadAppointments() {
    this.appointmentService.getDoctorAppointment().subscribe(res => {
      this.appointments = res.map(a => ({
        ...a,
        groupedItems: this.groupByDay(a.details)
      }));
    });
  }


  groupByDay(details: DoctorAvailabilityDetail[]): Record<string, GroupedAppointment[]> {
    const groups: Record<string, GroupedAppointment[]> = {};

    details.forEach(d => {
      if (!groups[d.dayOfWeek]) groups[d.dayOfWeek] = [];

      d.appointmentDate.forEach(date => {
        groups[d.dayOfWeek].push({
          appointmentDate: date,
          doctorAvailabilityId: d.doctorAvailabilityId // إضافة الـ id
        });
      });
    });

    return groups;
  }




  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  selectedDate: GroupedAppointment | null = null;



  isSelected(item: GroupedAppointment): boolean {
    return this.selectedDate === item;
  }




  toggleOuter(i: number) {
    this.openedOuterIndex = this.openedOuterIndex === i ? null : i;
  }

  toggleInner(outer: number, inner: number) {
    if (!this.openedInnerIndex[outer]) this.openedInnerIndex[outer] = null;
    this.openedInnerIndex[outer] =
      this.openedInnerIndex[outer] === inner ? null : inner;
  }

  selectDate(item: GroupedAppointment) {
    // تمرير التاريخ للترجمة
    const dateStr = formatDate(item.appointmentDate, 'dd/MM/yyyy', 'en-US');

    this.translate
      .get([
        'CONFIRM.TITLE',
        'CONFIRM.TEXT',
        'CONFIRM.CONFIRM_BUTTON',
        'CONFIRM.CANCEL_BUTTON',
        'CONFIRM.SUCCESS_TITLE',
        'CONFIRM.SUCCESS_TEXT',
        'CONFIRM.ERROR_TITLE',
        'CONFIRM.ERROR_TEXT'
      ], { date: dateStr })
      .subscribe(translations => {
        Swal.fire({
          title: translations['CONFIRM.TITLE'],
          text: translations['CONFIRM.TEXT'],
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#673ab7',
          cancelButtonColor: '#d33',
          confirmButtonText: translations['CONFIRM.CONFIRM_BUTTON'],
          cancelButtonText: translations['CONFIRM.CANCEL_BUTTON']
        }).then(result => {
          if (result.isConfirmed) {
            const payload: CancelDayRequest = {
              doctorAvailabilityId: item.doctorAvailabilityId,
              day: item.appointmentDate
            };

            this.appointmentService.canceDoctorAllDay(payload).subscribe({
              next: () => {
                Swal.fire(
                  translations['CONFIRM.SUCCESS_TITLE'],
                  translations['CONFIRM.SUCCESS_TEXT'],
                  'success'
                );
                this.loadAppointments();
              },
              error: (err) => {
                Swal.fire(
                  translations['CONFIRM.ERROR_TITLE'],
                  translations['CONFIRM.ERROR_TEXT'],
                  'error'
                );
                console.error('حدث خطأ أثناء الإلغاء', err);
              }
            });
          }
        });
      });
  }



}
