import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { availabilities, DoctorAddress } from 'src/app/Models/Doctor/userResponse/userResponse';
import { CountryService } from 'src/services/country.service';
import { cityResponse } from 'src/app/Models/Responses/CityResponse';
import { RegionResponse } from 'src/app/Models/Responses/RegionResponse';
import { FormArray } from '@angular/forms';
import { DaysOfWeek, ShardEnums } from 'src/app/Models/shared/SharedClasses';
import { DoctorService } from 'src/services/doctor.service';
import { AddressRequest } from 'src/app/Models/Doctor/DoctorCreateRequest';
import { ToastService } from 'src/services/ToastService';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, MatSelectModule],
  templateUrl: './create-address.component.html',
  styleUrl: './create-address.component.scss'
})
export class CreateAddressComponent implements OnInit {

  countryService = inject(CountryService);
  translate = inject(TranslateService)
  city: cityResponse[] = [];
  regions: RegionResponse[] = [];
  cdr = inject(ChangeDetectorRef);
  addressForm: FormGroup;
  daysOfWeek = ShardEnums.getEnumOptions(DaysOfWeek);
  doctorService = inject(DoctorService);
  toast = inject(ToastService)
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<CreateAddressComponent>);
  data = inject<DoctorAddress>(MAT_DIALOG_DATA);

  appointmentCategories = [
    { value: 0, text: this.translate.instant('AVAILABILITY.Examination') },
    { value: 1, text: this.translate.instant('AVAILABILITY.Consultation') }
  ];


  constructor(

  ) {
    this.addressForm = this.fb.group({
      addressName: [this.data.addressName, Validators.required],
      country: [this.data.country, Validators.required],
      cityId: [this.data.cityId, Validators.required],
      regionId: [this.data.regionId, Validators.required],
      postalCode: [this.data.postalCode],
      street: [this.data.street, Validators.required],
      buildingNumber: [this.data.buildingNumber],
      phoneNumber: [this.data.phoneNumber, Validators.required],
      googleLocation: [this.data.googleLocation],

      availabilities: this.fb.array([])
    });

  }
  ngOnInit(): void {
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


  private setCityAndRegion(): void {
    if (!this.data?.cityId) return;

    // 1️⃣ تعيين المدينة
    const selectedCity = this.city.find(c => c.value === this.data.cityId);
    if (!selectedCity) return;

    this.addressForm.get('cityId')?.setValue(selectedCity.value);

    // 2️⃣ تحميل المناطق التابعة للمدينة
    this.countryService.getRegions('en', selectedCity.value).subscribe({
      next: (regions) => {
        this.regions = regions;

        // 3️⃣ تعيين المنطقة لو موجودة
        if (this.data?.regionId) {
          const selectedRegion = this.regions.find(
            r => r.value === this.data.regionId
          );

          if (selectedRegion) {
            this.addressForm.get('regionId')?.setValue(selectedRegion.value);
          }
        }

        this.cdr.detectChanges();
      }
    });
  }

  get availabilities(): FormArray {
    return this.addressForm.get('availabilities') as FormArray;
  }

  createAvailability() {
    return this.fb.group({
      dayOfWeek: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      category: [0, Validators.required],
      slotTime: [15, Validators.required]
    });
  }

  addAvailability() {
    this.availabilities.push(this.createAvailability());
  }

  removeAvailability(index: number) {
    this.availabilities.removeAt(index);
  }


  onCityChange(cityId: string): void {
    this.addressForm.get('regionId')?.reset();
    this.regions = [];

    if (!cityId) return;

    this.countryService.getRegions('en', cityId).subscribe({
      next: (regions) => {
        this.regions = regions;
        this.cdr.detectChanges();
      }
    });
  }



  save() {
    if (this.addressForm.invalid) return;

    const availabilities = this.addressForm.value.availabilities.map((a: availabilities) => ({
      ...a,
      startTime: a.startTime.includes(':') && a.startTime.split(':').length === 2 ? `${a.startTime}:00` : a.startTime,
      endTime: a.endTime.includes(':') && a.endTime.split(':').length === 2 ? `${a.endTime}:00` : a.endTime,
      dayOfWeek: Number(a.dayOfWeek),
      category: Number(a.category)
    }));

    const request: AddressRequest = {
      ...this.addressForm.value,
      availabilities,
      doctorId: this.data.doctorId
    };

    this.doctorService.createAddress(request).subscribe({
      next: (res) => {
        this.toast.success('Create Address Successfully');
        this.dialogRef.close(res);
      },
      error: (err) => {
        console.error('Create address failed', err);
        this.toast.error('Failed to create address');
      }
    });
  }


  cancel() {
    this.dialogRef.close(null);
  }
}
