import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Availability, UpdateAddressRequest } from 'src/app/Models/Doctor/AddressUpdateRequest';
import { cityResponse } from 'src/app/Models/Responses/CityResponse';
import { AddressResponse } from 'src/app/Models/Responses/DoctorResponses';
import { RegionResponse } from 'src/app/Models/Responses/RegionResponse';
import { ShardEnums, DaysOfWeek } from 'src/app/Models/shared/SharedClasses';
import { timeRangeValidator, ValidationError } from 'src/app/shared/validation-error/validation-error';
import { CountryService } from 'src/services/country.service';
import { DoctorService } from 'src/services/doctor.service';
import { ToastService } from 'src/services/ToastService';

@Component({
  selector: 'app-edit-address-component',
  imports: [ReactiveFormsModule, MatOption, NgFor, MatSelectModule, NgIf, ValidationError, TranslateModule],
  templateUrl: './edit-address-component.html',
  styleUrl: './edit-address-component.scss',
})
export class EditAddressComponent implements OnInit {
  toast = inject(ToastService);
  doctorService = inject(DoctorService);
  dialogRef = inject(MatDialogRef<EditAddressComponent>);
  addressId: string;
  doctorId: string;
  fb = inject(FormBuilder);
  addressData = inject(MAT_DIALOG_DATA) as AddressResponse;
  cdr = inject(ChangeDetectorRef);

  form: FormGroup = this.fb.group({});
  days = ShardEnums.getEnumOptions(DaysOfWeek);
  route = inject(ActivatedRoute)
  countryService = inject(CountryService);
  city: cityResponse[] = [];
  regions: RegionResponse[] = [];
  currentLang: string = 'en'; // 🔹 هنا الخاصية المفقودة
  translate = inject(TranslateService)
  appointmentCategories = [
    { value: 0, text: this.translate.instant('AVAILABILITY.Examination') },
    { value: 1, text: this.translate.instant('AVAILABILITY.Consultation') }
  ];


  ngOnInit(): void {
    this.createForm(); // الفورم جاهز، addresses موجودة

    this.addressId = this.addressData?.addressId;

    // 1️⃣ تحميل المدن
    this.countryService.getCountries('en', 'EGYPT').subscribe({
      next: (cities) => {
        this.city = cities; // array of { value, text }

        // بعد تحميل المدن، حدّد المدينة الموجودة
        this.setCityAndRegion();

        this.cdr.detectChanges();
      }
    });
  }


  private setCityAndRegion() {
    if (!this.addressData?.cityId) return;

    const selectedCity = this.city.find(c => c.value === this.addressData.cityId);
    if (selectedCity) {
      this.form.get('cityId')?.setValue(selectedCity.value);

      // تحميل المناطق الخاصة بهذه المدينة
      this.countryService.getRegions('en', selectedCity.value).subscribe({
        next: (regions) => {
          this.regions = regions;

          // تعيين المنطقة إذا موجودة
          if (this.addressData?.regionId) {
            const selectedRegion = this.regions.find(r => r.value === this.addressData.regionId);
            if (selectedRegion) {
              this.form.get('regionId')?.setValue(selectedRegion.value);
            }
          }
          this.cdr.detectChanges();
        }
      });
    }
  }


  patchCityAndRegion() {
    if (this.addressData?.cityId) {
      const selectedCity = this.city.find(c => c.value === this.addressData.cityId);
      if (selectedCity) {
        this.form.get('cityId')?.setValue(selectedCity.value);
        this.loadRegions('en', selectedCity.value, this.addressData?.regionId);
      }
    }
  }


  createForm() {
    // إنشاء الفورم
    this.form = this.fb.group({
      doctorId: [this.addressData?.doctorId, Validators.required],
      addressId: [this.addressData?.addressId],
      addressName: [this.addressData?.addressName, Validators.required],
      cityId: [null, Validators.required],
      isDeleted: [this.addressData?.isDeleted, Validators.required],
      regionId: [null, Validators.required],
      googleLocation: [this.addressData?.googleLocation],
      postalCode: [this.addressData?.postalCode, Validators.required],
      street: [this.addressData?.street, Validators.required],
      buildingNumber: [this.addressData?.buildingNumber, Validators.required],
      phoneNumber: [this.addressData?.phoneNumber, [Validators.required, Validators.pattern(/^01[0-2,5]\d{8}$/)]],
      country: [this.addressData?.country || 'EGYPT'],
      availabilities: this.fb.array(
        (this.addressData?.availabilities || []).map(a => this.fb.group({
          isDeleted: [a.isDeleted],
          doctorAvailabilityId: [a.doctorAvailabilityId],
          addressId: [a.addressId, Validators.required],
          dayOfWeek: [a.dayOfWeek, Validators.required],
          startTime: [a.startTime, Validators.required],
          slotTime: [a.slotTime, Validators.required],
          endTime: [a.endTime, Validators.required],
          category: [a.category ?? 0, Validators.required]
        }))
      )
    });

    // تعيين المدينة القديمة تلقائيًا إذا موجودة
    if (this.addressData?.city) {
      const selectedCity = this.city.find(c => c.value === this.addressData.cityId);

      if (selectedCity) {
        this.form.get('cityId')?.setValue(selectedCity.value);

        // تحميل المناطق الخاصة بهذه المدينة
        this.loadRegions('en', selectedCity.value, this.addressData?.region);
      }
    }

    // الاستماع لتغيير المدينة من قبل المستخدم
    this.form.get('cityId')?.valueChanges.subscribe(cityId => {
      if (cityId) {
        this.loadRegions('en', cityId);
        // تفريغ المنطقة القديمة
        this.form.get('regionId')?.setValue(null);
      }
    });
  }

  loadRegions(lang: string, cityId: string, selectedRegionText?: string) {
    this.countryService.getRegions(lang, cityId).subscribe({
      next: (regions) => {
        this.regions = regions;

        // إذا تم تمرير region القديم، حدده تلقائيًا
        if (selectedRegionText) {
          const selRegion = this.regions.find(r => r.text === selectedRegionText);
          if (selRegion) {
            this.form.get('regionId')?.setValue(selRegion.value);
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }


  getAvailabilities(): FormArray {
    return this.form.get('availabilities') as FormArray;
  }

  addAvailability() {
    const availabilities = this.getAvailabilities();

    availabilities.push(
      this.fb.group(
        {
          isDeleted: [false],
          addressId: [this.addressId, Validators.required],
          dayOfWeek: [0, Validators.required],
          startTime: ['09:00:00', Validators.required],
          endTime: ['17:00:00', Validators.required],
          slotTime: [15, Validators.required]
        },
        { validators: timeRangeValidator }
      )
    );
  }


  private hasTimeOverlap(availabilities: Availability[]): boolean {

    // نحول الوقت لدقايق عشان المقارنة تبقى سهلة
    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    // نجمع حسب التاريخ (لأن كل يوم لوحده)
    const groupedByDate = availabilities.reduce((acc, curr) => {
      acc[curr.dayOfWeek] = acc[curr.dayOfWeek] || [];
      acc[curr.dayOfWeek].push(curr);
      return acc;
    }, {} as Record<string, Availability[]>);

    for (const date in groupedByDate) {
      const daySlots = groupedByDate[date];

      // نرتب حسب startTime
      daySlots.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

      for (let i = 0; i < daySlots.length - 1; i++) {
        const current = daySlots[i];
        const next = daySlots[i + 1];

        const start1 = toMinutes(current.startTime);
        const end1 = toMinutes(current.endTime);
        const start2 = toMinutes(next.startTime);
        const end2 = toMinutes(next.endTime);

        // شرط التداخل
        if (start1 < end2 && start2 < end1) {
          return true; // فيه تداخل
        }
      }
    }

    return false;
  }



  save() {
    const payload: UpdateAddressRequest = this.form.value;

    payload.availabilities = payload.availabilities.map(a => ({
      ...a,
      addressId: a.addressId || payload.addressId,
      startTime: a.startTime.length <= 5 ? a.startTime + ':00' : a.startTime,
      endTime: a.endTime.length <= 5 ? a.endTime + ':00' : a.endTime,
      category: a.category
    }));

    // ❌ منع التداخل
    if (this.hasTimeOverlap(payload.availabilities)) {
      this.toast.error('Time periods overlap on the same date');
      return;
    }

    this.doctorService.updateAddress(payload).subscribe({
      next: () => {
        this.toast.success('Updated Address Successfully');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Failed to update address');
      }
    });
  }





}




