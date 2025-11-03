import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { userResponse } from 'src/app/Models/Doctor/userResponse/userResponse';
import { CreateOfflineAppointmentRequest } from 'src/app/Models/Requests/CreateOfflineAppointmentRequest';
import { DoctorAvailableTime, DoctorAvialabilitiesModel } from 'src/app/Models/Responses/Current-AvailabilitiesResponse';
import { GetPatientByPhoneResponse } from 'src/app/Models/Responses/GetPatientByPhoneResponse ';
import { AppointmentStatus } from 'src/app/Models/shared/SharedClasses';
import { DoctorService } from 'src/services/doctor.service';
import { ToastService } from 'src/services/ToastService';


@Component({
  selector: 'app-current-availlabilities.component',
  imports: [CommonModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './current-availlabilities.component.html',
  styleUrl: './current-availlabilities.component.scss'
})
export class CurrentAvaillabilitiesComponent implements OnInit {
  doctorService = inject(DoctorService);
  toast = inject(ToastService)
  location = inject(Location)
  doctorId: string;
  patient: FormGroup
  fb = inject(FormBuilder)
  doctoravailabilities: DoctorAvialabilitiesModel;
  patientData: GetPatientByPhoneResponse | null = null;
  isLoading: boolean
  statusOptions: string[] = [];
  selectedAvailabilityId?: string;
  selectedDate?: string;
  selectedTime?: string;

  ngOnInit(): void {
    this.isLoading = true;

    this.statusOptions = Object.keys(AppointmentStatus).filter(k => isNaN(Number(k)));

    // 1️⃣ الحصول على doctorId
    this.doctorService.getuser('EN').subscribe({
      next: (res: userResponse) => {
        this.doctorId = res.doctorId;
        console.log('Doctor ID:', this.doctorId);

        // 2️⃣ جلب availabilities
        this.doctorService.getavailabilities(this.doctorId, 'EN').subscribe({
          next: (data) => {
            this.doctoravailabilities = data;

            // ✅ إنشاء الفورم
            this.patient = this.fb.group({
              fullName: ['', [Validators.required, Validators.minLength(3)]],
              phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
              status: ['Pending', Validators.required],
              notes: [''],
              doctorId: [this.doctorId],
              doctorAvailabilityId: [''],
              appointmentDate: [''],
              fromTime: ['']
            });

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
      if (!groups[day]) groups[day] = [];
      groups[day].push(time);
      return groups;
    }, {});
  }

  selectTime(t: DoctorAvailableTime): void {
    this.selectedAvailabilityId = t.doctorAvailabilityId;
    this.selectedDate = t.appointmentDate;
    this.selectedTime = t.time;

    this.patient.patchValue({
      doctorAvailabilityId: this.selectedAvailabilityId,
      appointmentDate: this.selectedDate,
      fromTime: this.selectedTime
    });

    console.log('🕒 تم اختيار الموعد:', t);
  }

  onPhoneBlur(): void {
    const phoneValue = this.patient.get('phoneNumber')?.value?.trim();

    console.log('📞 onPhoneBlur() =>', phoneValue);

    // لو الحقل فاضي، ما تعملش أي حاجة
    if (!phoneValue) return;

    // استدعاء الخدمة للتحقق من الرقم
    this.doctorService.checkPhoneNumber(phoneValue).subscribe({
      next: (res) => {
        console.log('✅ Patient found:', res);

        // لو رجعت بيانات، نعبّي الاسم تلقائيًا في الفورم
        this.patient.patchValue({
          fullName: res.fullName,
          phoneNumber: res.phoneNumber
        });
      },
      error: (err) => {
        console.error('❌ Error fetching patient:', err);
      }
    });
  }





  onSubmit(): void {
    if (this.patient.valid) {
      const payload: CreateOfflineAppointmentRequest = {
        ...this.patient.value,
        doctorId: this.doctorId,
        doctorAvailabilityId: this.selectedAvailabilityId!,
        appointmentDate: this.selectedDate!,
        fromTime: this.selectedTime!,
        appointmentType: 0, // Offline
        status: 0 // Pending
      };

      console.log('🚀 Payload to send:', payload);

      this.doctorService.createOfflineAppointment(payload).subscribe({
        next: (res) => {
          console.log('✅ Appointment created successfully:', res);
          this.toast.success('✅ Appointment created successfully:');
          this.patient.reset();
          // window.location.reload();
        },
        error: (err) => {
          console.error('❌ Error creating appointment:', err);
          this.toast.error('❌ Error creating appointment:')
        }
      });
    } else {
      this.patient.markAllAsTouched();
    }
  }

}

