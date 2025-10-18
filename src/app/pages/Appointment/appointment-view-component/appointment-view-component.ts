import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentDetailsResponse } from 'src/app/Models/Responses/AppointmentResponses';
import { AppointmentService } from 'src/services/AppointmentService';
import { ToastService } from 'src/services/ToastService';
import { NgIf, CommonModule, Location } from '@angular/common';
import { AppointmentStatus } from 'src/app/Models/shared/SharedClasses';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-view-component',
  standalone: true, // ✅ add this if it’s meant to be standalone
  imports: [CommonModule, NgIf, FormsModule],
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
  statusOptions: string[] = Object.keys(AppointmentStatus).filter(key => isNaN(Number(key)));
  selectedStatus: string;

  ngOnInit(): void {
    const appointmentId = this.route.snapshot.paramMap.get('id');

    if (!appointmentId) {
      this.toaster.error('No appointment found');
      this.router.navigate(['/dashboard']);
    }
    this.appointmentService.getAppointment(appointmentId, 'EN').subscribe((response) => {
      this.model = response;
      this.selectedStatus = Object.keys(AppointmentStatus)
        .find(key => AppointmentStatus[key as keyof typeof AppointmentStatus] === this.model.status) || '';
    });


  }



  changeStatus(statusKey: 'Cancelled' | 'Completed' | 'Confirmed') {
    if (!this.model) return;

    Swal.fire({
      title: `Are you sure you want to change status to ${statusKey}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        // Convert string key to numeric enum
        const statusValue = AppointmentStatus[statusKey as keyof typeof AppointmentStatus];

        // Update local model
        this.model.status = statusValue;
        this.selectedStatus = statusKey;

        // Call API to update backend
        this.appointmentService.updateAppointmentStatus(this.model.appointmentId, statusValue)
          .subscribe({
            next: () => {
              Swal.fire('Updated!', `Status changed to ${statusKey}`, 'success');
            },
            error: (err) => {
              Swal.fire('Error', 'Failed to update status', 'error');
              console.error(err);
            }
          });
      }
    });
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
