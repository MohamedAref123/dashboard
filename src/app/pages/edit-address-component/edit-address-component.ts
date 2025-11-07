import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UpdateAddressRequest } from 'src/app/Models/Doctor/AddressUpdateRequest';
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
  styleUrl: './edit-address-component.scss'
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
  isLoading: boolean;
  form: FormGroup = this.fb.group({});
  days = ShardEnums.getEnumOptions(DaysOfWeek);
  route = inject(ActivatedRoute)
  countryService = inject(CountryService);
  city: cityResponse[] = [];
  regions: RegionResponse[] = [];
  currentLang: string = 'en'; // 🔹 هنا الخاصية المفقودة
  translate = inject(TranslateService)


  ngOnInit(): void {
    this.isLoading = true;

    this.addressId = this.addressData?.addressId;

    // 1️⃣ تحميل المدن أولاً
    this.countryService.getCountries('en', 'EGYPT').subscribe({
      next: (cities) => {
        this.city = cities; // city.value يجب أن يكون ID الصحيح
        this.createForm();  // إنشاء الفورم بعد توفر المدن
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

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
      phoneNumber: [this.addressData?.phoneNumber, Validators.required],
      country: [this.addressData?.country || 'EGYPT'],
      availabilities: this.fb.array(
        (this.addressData?.availabilities || []).map(a => this.fb.group({
          isDeleted: [a.isDeleted],
          doctorAvailabilityId: [a.doctorAvailabilityId],
          addressId: [a.addressId, Validators.required],
          dayOfWeek: [a.dayOfWeek, Validators.required],
          startTime: [a.startTime, Validators.required],
          slotTime: [a.slotTime, Validators.required],
          endTime: [a.endTime, Validators.required]
        }))
      )
    });

    // تعيين المدينة القديمة تلقائيًا إذا موجودة
    if (this.addressData?.city) {
      const selectedCity = this.city.find(c => c.text === this.addressData.city);
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



  save() {
    const payload: UpdateAddressRequest = this.form.value;

    // ✅ تأكد من تحويل الوقت إلى HH:mm:00 قبل الإرسال
    payload.availabilities = payload.availabilities.map(a => ({
      ...a,
      addressId: a.addressId || payload.addressId,
      startTime: a.startTime.length <= 5 ? a.startTime + ':00' : a.startTime,
      endTime: a.endTime.length <= 5 ? a.endTime + ':00' : a.endTime,

    }));

    console.log('📦 Final payload:', payload);

    this.doctorService.updateAddress(payload).subscribe({
      next: () => {
        this.toast.success('Updated Address Successfully');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('❌ Update failed:', err);
        this.toast.error('Failed to update address');
      }
    });
  }



}




