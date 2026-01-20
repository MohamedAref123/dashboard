import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentDetailsResponse } from 'src/app/Models/Responses/AppointmentResponses';
import { AppointmentService } from 'src/services/AppointmentService';
import { ToastService } from 'src/services/ToastService';
import { NgIf, CommonModule, Location } from '@angular/common';
import { AppointmentStatus } from 'src/app/Models/shared/SharedClasses';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-appointment-view-component',
  standalone: true, // ✅ add this if it’s meant to be standalone
  imports: [CommonModule, NgIf, FormsModule, TranslateModule],
  templateUrl: './appointment-view-component.html',
  styleUrl: './appointment-view-component.scss'
})
export class AppointmentViewComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  private toaster = inject(ToastService);
  location = inject(Location);
  private appointmentService = inject(AppointmentService);
  model: AppointmentDetailsResponse;
  public AppointmentStatus = AppointmentStatus;

  // statusOptions: string[] = Object.keys(AppointmentStatus).filter(key => isNaN(Number(key)));
  //statusOptions: AppointmentStatus
  statusOptions: string[] = Object.keys(AppointmentStatus).filter((key) => isNaN(Number(key)));
  selectedStatus: string;

  private translate = inject(TranslateService);

  ngOnInit(): void {
    const appointmentId = this.route.snapshot.paramMap.get('id');

    if (!appointmentId) {
      this.toaster.error('No appointment found');
      this.router.navigate(['/dashboard']);
    }
    this.appointmentService.getAppointment(appointmentId, 'EN').subscribe((response) => {
      this.model = response;
      this.selectedStatus =
        Object.keys(AppointmentStatus).find((key) => AppointmentStatus[key as keyof typeof AppointmentStatus] === this.model.status) || '';
    });
  }

  getCategoryKey(category: number): string {
    switch (category) {
      case 0: return 'examination';
      case 1: return 'consultation';
      case 2: return 'operation';
      default: return 'unknown';
    }
  }

  changeStatus(statusKey: 'Cancelled' | 'Completed' | 'Confirmed') {
    if (!this.model) return;

    Swal.fire({
      title: `Are you sure you want to change status to ${statusKey}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      didOpen: () => {
        // رفع مستوى الـ z-index علشان يظهر فوق كل العناصر
        const swalPopup = document.querySelector('.swal2-container') as HTMLElement;
        if (swalPopup) {
          swalPopup.style.zIndex = '99999';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Convert string key to numeric enum
        const statusValue = AppointmentStatus[statusKey as keyof typeof AppointmentStatus];

        // Update local model
        this.model.status = statusValue;
        this.selectedStatus = statusKey;

        // Call API to update backend
        this.appointmentService.updateAppointmentStatus(this.model.appointmentId, statusValue).subscribe({
          // next: () => {
          //   Swal.fire({
          //     title: 'Updated!',
          //     text: `Status changed to ${statusKey}`,
          //     icon: 'success',
          //     didOpen: () => {
          //       const swalPopup = document.querySelector('.swal2-container') as HTMLElement;
          //       if (swalPopup) swalPopup.style.zIndex = '99999';
          //     }
          //   });
          // },
          // error: (err) => {
          //   Swal.fire({
          //     title: 'Error',
          //     text: 'Failed to update status',
          //     icon: 'error',
          //     didOpen: () => {
          //       const swalPopup = document.querySelector('.swal2-container') as HTMLElement;
          //       if (swalPopup) swalPopup.style.zIndex = '99999';
          //     }
          //   });
          //   console.error(err);
          // }
        });
      }
    });
  }

  // في component.ts
  actionLabels = {
    CONFIRMED: { ar: 'تأكيد', en: 'Confirm' },
    CANCELLED: { ar: 'إلغاء', en: 'Cancel' },
    COMPLETED: { ar: 'مكتمل', en: 'Complete' } // إذا أردت الاحتفاظ بها
  };

  getLabel(action: string): string {
    const lang = this.translate.currentLang; // اللغة الحالية من ngx-translate
    return this.actionLabels[action.toUpperCase()][lang] || action;
  }

  getAllowedActions(): ('Confirmed' | 'Cancelled' | 'Completed')[] {
    if (!this.model) return [];

    switch (this.model.status) {
      case AppointmentStatus.Pending:
        return ['Confirmed', 'Cancelled'];
      case AppointmentStatus.Confirmed:
        return ['Cancelled', 'Completed'];
      default:
        return []; // Cancelled or Completed => no actions
    }
  }

  back() {
    //this.router.navigate(['/dashboard']);
    this.location.back();
  }
}
