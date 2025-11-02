import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { userResponse } from 'src/app/Models/Doctor/userResponse/userResponse';
import { DoctorAvailableTime, DoctorAvialabilitiesModel } from 'src/app/Models/Responses/Current-AvailabilitiesResponse';
import { DoctorService } from 'src/services/doctor.service';


@Component({
  selector: 'app-current-availlabilities.component',
  imports: [CommonModule, TranslateModule],
  templateUrl: './current-availlabilities.component.html',
  styleUrl: './current-availlabilities.component.scss'
})
export class CurrentAvaillabilitiesComponent implements OnInit {
  doctorService = inject(DoctorService);
  doctorId: string;

  doctoravailabilities: DoctorAvialabilitiesModel;
  isLoading: boolean

  ngOnInit(): void {
    this.isLoading = true;

    // 1️⃣ أولاً نحصل على doctorId
    this.doctorService.getuser("EN").subscribe({
      next: (res: userResponse) => {
        this.doctorId = res.doctorId;
        console.log('Doctor ID is:', this.doctorId);

        // 2️⃣ بعد الحصول على doctorId، نطلب availabilities
        this.doctorService.getavailabilities(this.doctorId, "EN")
          .subscribe({
            next: (data) => {
              this.doctoravailabilities = data;
              console.log('Availabilities:', data);
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error loading availabilities:', err);
              this.isLoading = false;
            }
          });
      },
      error: (err) => {
        console.error('Error getting user:', err);
        this.isLoading = false;
      }
    });
  }


  groupByDay(times: DoctorAvailableTime[]): Record<string, DoctorAvailableTime[]> {
    if (!times) return {};
    return times.reduce((groups: Record<string, DoctorAvailableTime[]>, time: DoctorAvailableTime) => {
      const day = time.dayOfWeek;
      if (!groups[day]) {
        groups[day] = [];
      }
      groups[day].push(time);
      return groups;
    }, {});
  }
}

