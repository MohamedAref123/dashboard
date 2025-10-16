import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentDetailsResponse } from 'src/app/Models/Responses/AppointmentResponses';
import { AppointmentService } from 'src/services/AppointmentService';
import { ToastService } from 'src/services/ToastService';
import { NgIf, CommonModule, Location, NgFor } from '@angular/common';
import { AppointmentStatus } from 'src/app/Models/shared/SharedClasses';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-appointment-view-component',
  standalone: true, // ✅ add this if it’s meant to be standalone
  imports: [CommonModule, NgIf, FormsModule, NgFor],
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
      this.selectedStatus = AppointmentStatus[this.model.status];
    });


  }

  back() {
    //this.router.navigate(['/dashboard']);
    this.location.back();
  }
}
