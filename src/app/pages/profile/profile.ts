import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { DoctorAddress, userResponse } from 'src/app/Models/Doctor/userResponse/userResponse';
import { DoctorService } from 'src/services/doctor.service';
import { ShardEnums, DaysOfWeek, Genders, AppointmentCategory } from 'src/app/Models/shared/SharedClasses';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditAddressComponent } from '../edit-address-component/edit-address-component';
import { ToastService } from 'src/services/ToastService';
import { Router } from '@angular/router';
import { arabicOnlyValidator, englishOnlyValidator, ValidationError } from 'src/app/shared/validation-error/validation-error';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { InsurancesResponse } from 'src/app/Models/Responses/insurancesResponse';
import { InsuransesService } from 'src/services/insuranses.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DoctorSpecialistService } from 'src/services/DoctorSpecialistService';
import { DoctorSpecialistResponse } from 'src/app/Models/Responses/DoctorSpecialistResponses';
import { imageResponse } from 'src/app/Models/Responses/ImageResponse';
import { environment } from 'src/environments/environment';
import { DoctorClaims } from 'src/app/Models/shared/system-claims';
import { AuthService } from 'src/services/auth.service';
import { CreateAddressComponent } from '../create-address.component/create-address.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatSelectModule,
    NgFor,
    MatIcon,
    MatDialogModule,
    ValidationError,
    MatOption,
    NgIf
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  private dialog = inject(MatDialog);
  days = ShardEnums.getEnumOptions(DaysOfWeek);
  genders = ShardEnums.getEnumstring(Genders);
  profileForm: FormGroup;
  doctorService = inject(DoctorService);
  fb = inject(FormBuilder);
  toast = inject(ToastService);
  router = inject(Router);
  private translate = inject(TranslateService);
  private baseAttatchementUrl = environment.baseAttatchementUrl;
  insurances: InsurancesResponse[] = [];

  insuranceService = inject(InsuransesService);

  doctorSpecialistService = inject(DoctorSpecialistService);
  specialists: DoctorSpecialistResponse[] = [];

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  profileImageUrl: string | null = null;
  doctorId: string = ''; // ✅ لحفظ الـ id

  openedIndex: number | null = null;

  appointmentCategories = ShardEnums.getEnumOptions(AppointmentCategory);

  DoctorClaims = DoctorClaims;
  authService = inject(AuthService);
  constructor() {}

  ngOnInit(): void {
    this.doctorService.getuser('EN').subscribe((res: userResponse) => {
      this.patchForm(res);

      this.doctorId = res.doctorId;
      this.profileImageUrl = this.getImageUrl(res.image);
      this.previewUrl = this.profileImageUrl;
    });

    this.loadInsurances();
    this.loadSpecialists();
  }

  hasPermission(claim: DoctorClaims): boolean {
    return this.authService.has(claim);
  }
  getSelectedInsuranceNames(): string {
    const selectedIds = (this.profileForm.get('insurances')?.value as string[]) || [];

    return this.insurances
      .filter((x) => selectedIds.includes(x.value))
      .map((x) => x.text)
      .join(', ');
  }
  toggleAccordion(i: number) {
    this.openedIndex = this.openedIndex === i ? null : i;
  }

  loadSpecialists(): void {
    this.doctorSpecialistService.GetAll().subscribe({
      next: (data) => {
        this.specialists = data;
      },
      error: (err) => console.error('Failed to load specialists:', err)
    });
  }

  loadInsurances(): void {
    this.insuranceService.getInsurances('en').subscribe({
      next: (data) => {
        this.insurances = data;
      },
      error: (err) => console.error('Failed to load insurances:', err)
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      // معاينة الصورة قبل الرفع
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    // لو السيرفر بيرجع فقط اسم الملف أو المسار النسبي، أضف الدومين الأساسي
    if (path.startsWith('http')) {
      return path; // الصورة فيها رابط كامل
    }
    return `${this.baseAttatchementUrl}${path}` + '?t=' + Date.now();
  }

  onUploadImage(): void {
    if (!this.selectedFile || !this.doctorId) {
      this.translate.get('PROFILE.SELECT_IMAGE').subscribe((res: string) => {
        this.toast.error(res); // الرسالة العربية من ملف الترجمة
      });

      return;
    }

    this.doctorService.uploadDoctorImage(this.doctorId, this.selectedFile, 'en').subscribe({
      next: (res: imageResponse) => {
        this.toast.success('✅ Image uploaded successfully!');

        this.selectedFile = null;
        // 🔥 أضف query لتجديد الرابط وتفادي الكاش
        const newUrl = `${res.profilePath}?t=${new Date().getTime()}`;

        this.profileImageUrl = this.getImageUrl(newUrl);
        this.previewUrl = newUrl;
      },
      error: (err) => {
        console.error('🔴 Upload error details:', err);
        if (err.status === 401) {
          this.toast.error('Unauthorized (invalid or missing token)');
        } else if (err.status === 404) {
          this.toast.error('Upload URL not found (404)');
        } else if (err.status === 405) {
          this.toast.error('Method not allowed (check POST method)');
        } else if (err.status === 0) {
          this.toast.error('Network error — maybe CORS or server down');
        } else {
          this.toast.error(`❌ Upload failed: ${err.message || 'Unknown error'}`);
        }
      }
    });
  }

  get getAddresses(): FormArray {
    return this.profileForm.get('addresses') as FormArray;
  }

  private createAddressesArray(addresses: DoctorAddress[]): FormArray {
    return this.fb.array(
      addresses.map((address) =>
        this.fb.group({
          addressName: [address.addressName],
          country: [address.country],
          city: [address.city],
          region: [address.region],
          postalCode: [address.postalCode],
          street: [address.street],
          buildingNumber: [address.buildingNumber],
          phoneNumber: [address.phoneNumber],
          isDeleted: [address.isDeleted],
          addressId: [address.addressId],
          googleLocation: [address.googleLocation],
          //isDeleted: [address.isDeleted],
          availabilities: this.fb.array(
            (address.availabilities || []).map((av) =>
              this.fb.group({
                addressId: [av.addressId],
                doctorAvailabilityId: [av.doctorAvailabilityId],
                dayOfWeek: [av.dayOfWeek],
                startTime: [av.startTime],
                endTime: [av.endTime],
                slotTime: [av.slotTime, [Validators.required, Validators.min(1)]], // ✅ مضاف حديثًا
                isDeleted: [av.isDeleted],
                category: [av.category ?? null, Validators.required]
              })
            )
          )
        })
      )
    );
  }

  private patchForm(user: userResponse) {
    this.profileForm = this.fb.group({
      doctorId: user.doctorId,
      insurances: [user.insurances?.map((a) => a.value) ?? []], // ✅ استخدم value فقط
      doctorSpecialistId: user.doctorSpecialistId,
      doctorNameAR: user.doctorNameAR,
      doctorNameEN: user.doctorNameEN,
      email: user.email,
      phoneNumber: user.phoneNumber,
      licenseNumber: user.licenseNumber,
      yearsOfExperience: user.yearsOfExperience,

      gender: user.gender,
      examinationPrice: user.examinationPrice,
      consultationPrice: user.consultationPrice,
      descriptionAR: [user.descriptionAR, arabicOnlyValidator],
      descriptionEN: [user.descriptionEN, englishOnlyValidator],
      education: user.education,
      addresses: this.createAddressesArray(user.addresses)
    });

    this.profileImageUrl = user.profileImagePath || null;
    this.previewUrl = this.profileImageUrl; // لعرضها مباشرة
  }

  reloadAddresses() {
    this.doctorService.getuser('EN').subscribe((res: userResponse) => {
      const updatedAddresses = this.createAddressesArray(res.addresses);
      this.profileForm.setControl('addresses', updatedAddresses);
      this.toast.success('Address list updated successfully');
    });
  }

  getDayName(dayValue: number): string {
    const day = this.days.find((d) => d.value === dayValue);
    return day ? day.text : '';
  }

  getCategoryName(value: number): string {
    switch (value) {
      case 0:
        return this.translate.instant('AVAILABILITY.EXAMINATION');
      case 1:
        return this.translate.instant('AVAILABILITY.CONSULTATION');
      default:
        return '';
    }
  }

  addAddress() {
    const newAddress: DoctorAddress = {
      googleLocation: '',
      country: '',
      city: '',
      cityId: '',
      regionId: '',
      region: '',
      postalCode: '',
      street: '',
      buildingNumber: '',
      phoneNumber: '',
      addressName: '',
      addressId: '',
      doctorId: this.profileForm.get('doctorId')?.value,
      isDeleted: false,
      availabilities: []
    };
    const dialogRef = this.dialog.open(CreateAddressComponent, {
      width: '1000px',
      maxWidth: '100vw',
      data: {
        ...newAddress
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // ✅ تم الحفظ بنجاح داخل EditAddressComponent
        this.reloadAddresses(); // 🔹 سنضيف هذه الدالة الآن
      }
    });
  }

  onUpdateAddress(addr: DoctorAddress) {
    console.log('Address data:', addr);

    const dialogRef = this.dialog.open(EditAddressComponent, {
      width: '1000px',
      maxWidth: '100vw',

      data: {
        ...addr,
        doctorId: this.profileForm.get('doctorId')?.value, // ✅ إضافة doctorId هنا
        cityId: addr.cityId, // ✔ فقط القيمة الصحيحة
        regionId: addr.regionId // ✔ فقط القيمة الصحيحة
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // ✅ تم الحفظ بنجاح داخل EditAddressComponent
        this.reloadAddresses(); // 🔹 سنضيف هذه الدالة الآن
      }
    });
  }

  onSubmit() {
    console.log('Form Value:', this.profileForm.value);
    this.doctorService.updateDoctor(this.profileForm.value).subscribe({
      next: () => {
        this.translate.get('PROFILE.SUCCESS_UPDATE').subscribe((res: string) => {
          this.toast.success(res); // الرسالة العربية من ملف الترجمة
        });
      },
      error: (err) => {
        console.log(err);
        this.translate.get('PROFILE.FAILED_UPDATE').subscribe((res: string) => {
          this.toast.error(res); // رسالة الخطأ من ملف الترجمة
        });
      }
    });
  }
}
