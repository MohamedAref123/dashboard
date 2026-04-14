import { CommonModule, Location } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { jwtDecode } from 'jwt-decode';
import { CreateOfflineAppointmentRequest } from 'src/app/Models/Requests/CreateOfflineAppointmentRequest';
import { DoctorAvailableTime, DoctorAvialabilitiesModel } from 'src/app/Models/Responses/Current-AvailabilitiesResponse';
import { GetPatientByPhoneResponse } from 'src/app/Models/Responses/GetPatientByPhoneResponse ';
import { AppointmentCategory, AppointmentStatus, JwtPayload } from 'src/app/Models/shared/SharedClasses';
import { DoctorService } from 'src/services/doctor.service';
import { ToastService } from 'src/services/ToastService';
import { ValidationError } from 'src/app/shared/validation-error/validation-error';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'app-current-availlabilities.component',
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, NgbAccordionModule, ValidationError],
  templateUrl: './current-availlabilities.component.html',
  styleUrl: './current-availlabilities.component.scss'
})


export class CurrentAvaillabilitiesComponent implements OnInit, AfterViewInit {
  doctorService = inject(DoctorService);
  toast = inject(ToastService);
  location = inject(Location);
  doctorId: string;
  patient: FormGroup;
  fb = inject(FormBuilder);
  doctoravailabilities: DoctorAvialabilitiesModel;
  patientData: GetPatientByPhoneResponse | null = null;
  isLoading: boolean;
  statusOptions: string[] = [];
  selectedAvailabilityId: string | number | null = null;
  selectedSlotId: string | null = null;
  selectedDate?: string;
  selectedTime?: string;
  translate = inject(TranslateService);
  collapseInstances: bootstrap.Collapse[] = [];
  openedOuterIndex: number | null = null;
  openedInnerIndex: { [outerIndex: number]: number | null } = {};

  constructor() {
    this.doctorId = '';
    this.patient = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      chronicDiseases: [null],
      medicines: [null],
      surgeries: [null],
      status: ['Pending', Validators.required],
      notes: [''],
      bloodType: [''],
      birthday: [null, Validators.required],
      doctorId: [this.doctorId],
      doctorAvailabilityId: [''],
      appointmentDate: ['', Validators.required],
      fromTime: ['']
    });
    this.isLoading = false;
  }
  ngOnInit(): void {
    // ✅ إنشاء الفورم
    this.patient = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      chronicDiseases: [null],
      medicines: [null],
      surgeries: [null],
      status: ['Pending', Validators.required],
      notes: [''],
      bloodType: [''],
      birthday: [null, Validators.required],
      doctorId: [this.doctorId],
      doctorAvailabilityId: [''],
      appointmentDate: ['', Validators.required],
      fromTime: ['']
    });

    this.isLoading = true;

    this.statusOptions = Object.keys(AppointmentStatus).filter((k) => isNaN(Number(k)));

    this.initiateAvailabilities();
  }

  ngAfterViewInit() {
    this.initAccordion();
  }

  initAccordion() {
    // تدمير أي instance قديمة
    this.collapseInstances.forEach((c) => c.hide());
    this.collapseInstances = [];
    // إنشاء collapse جديد لكل عنصر
    const elements = document.querySelectorAll('.collapse');
    elements.forEach((el) => {
      const collapse = new bootstrap.Collapse(el as HTMLElement, { toggle: false });
      this.collapseInstances.push(collapse);
    });
  }


  // toggleCollapse(index: number) {
  //   const el = document.getElementById('collapse-' + index);
  //   if (!el) return;
  //   const instance = this.collapseInstances.find((c) => c._element === el);
  //   if (instance) instance.toggle();
  // }

  initOpenedIndices() {
    // تهيئة المصفوفة/الخريطة لضمان عدم undefined
    this.openedOuterIndex = null;
    this.openedInnerIndex = {};
    if (this.doctoravailabilities?.availableAppointments) {
      this.doctoravailabilities.availableAppointments.forEach((_, i) => {
        this.openedInnerIndex[i] = null;
      });
    }
  }

  toggleOuter(index: number) {
    this.openedOuterIndex = this.openedOuterIndex === index ? null : index;
    // optional: close inners of other outer when switching
    // Object.keys(this.openedInnerIndex).forEach(k => { if (+k !== index) this.openedInnerIndex[+k] = null; });
  }

  toggleInner(outerIndex: number, innerIndex: number) {
    if (this.openedInnerIndex[outerIndex] == null) {
      this.openedInnerIndex[outerIndex] = null;
    }
    this.openedInnerIndex[outerIndex] = this.openedInnerIndex[outerIndex] === innerIndex ? null : innerIndex;
  }

  initiateAvailabilities() {
    if (!this.doctorId) {
      const decoded = jwtDecode<JwtPayload>(this.getToken());

      this.doctorId = decoded.LoggedId;
    }

    // 1️⃣ الحصول على doctorId
    // 2️⃣ جلب availabilities
    this.doctorService.getavailabilities(this.doctorId, 'EN').subscribe({
      next: (data) => {
        this.doctoravailabilities = data;
        this.doctoravailabilities.availableAppointments.forEach((appointment) => {
          appointment.groupedItems = this.groupByDayAndCategory(appointment.doctorAvailableTimes);
        });
        this.initOpenedIndices();
        console.log('✅ Availabilities loaded:', data);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading availabilities:', err);
        this.isLoading = false;
      }
    });
  }


  groupByDayAndCategory(times: DoctorAvailableTime[]): Record<string, Record<AppointmentCategory, DoctorAvailableTime[]>> {
    const grouped: Record<string, Record<AppointmentCategory, DoctorAvailableTime[]>> = {};

    times.forEach(time => {
      const day = time.dayOfWeek.toString();
      const cat = time.category;

      // أنشئ كل الفئات 0 و 1 لكل يوم إذا لم تكن موجودة
      if (!grouped[day]) {
        grouped[day] = {
          0: [],
          1: []
        };
      }

      grouped[day][cat].push(time);
    });

    return grouped;
  }




  selectTime(t: DoctorAvailableTime): void {
    this.selectedSlotId = `${t.doctorAvailabilityId}-${t.time}-${t.appointmentDate}`;

    this.selectedAvailabilityId = t.doctorAvailabilityId;
    this.selectedDate = t.appointmentDate;
    this.selectedTime = t.time;

    this.patient.patchValue({
      doctorAvailabilityId: this.selectedAvailabilityId,
      appointmentDate: this.selectedDate,
      fromTime: this.selectedTime
    });

    console.log('🕒 Selected time:', t);
  }

  isSelected(t: DoctorAvailableTime): boolean {
    return this.selectedSlotId === `${t.doctorAvailabilityId}-${t.time}-${t.appointmentDate}`;
  }

  onPhoneBlur(): void {
    const phoneValue = this.patient.get('phoneNumber')?.value?.trim();
    if (!phoneValue) return;

    this.doctorService.checkPhoneNumber(phoneValue).subscribe({
      next: (res) => {
        console.log('✅ Patient found:', res);
        if (res && res.fullName) {

          // تحويل birthday للصيغة yyyy-MM-dd
          let formattedBirthday = null;
          if (res.birthday) {
            const d = new Date(res.birthday);
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            formattedBirthday = `${d.getFullYear()}-${month}-${day}`;
          }

          this.patient.patchValue({
            fullName: res.fullName,
            phoneNumber: res.phoneNumber,
            surgeries: res.surgeries,
            medicines: res.medicines,
            chronicDiseases: res.chronicDiseases,
            birthday: formattedBirthday,
            bloodType: res.bloodType
          });
        }
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
          this.toast.success(this.translate.instant('APPOINTMENT.CREATED_SUCCESS'));
          const currentStatus = this.patient.get('status')?.value;
          this.patient.reset({ status: currentStatus });
          this.initiateAvailabilities();
          console.log(res);
          // window.location.reload();
        },
        error: (err) => {
          console.error('❌ Error creating appointment:', err);
          this.toast.error(this.translate.instant('APPOINTMENT.CREATE_ERROR'));
        }
      });
    } else {
      this.patient.markAllAsTouched();
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
