import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatLabel, MatOption, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { UpdateAddressRequest } from 'src/app/Models/Doctor/AddressUpdateRequest';

import { AddressResponse, AvailabilityResponse } from 'src/app/Models/Responses/DoctorResponses';
import { ShardEnums, DaysOfWeek } from 'src/app/Models/shared/SharedClasses';
import { timeRangeValidator } from 'src/app/shared/validation-error/validation-error';
import { DoctorService } from 'src/services/doctor.service';
import { ToastService } from 'src/services/ToastService';

@Component({
  selector: 'app-edit-address-component',
  imports: [MatLabel, ReactiveFormsModule, MatOption, NgFor, MatSelectModule, NgIf],
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

  ngOnInit(): void {
    console.log("Dialog Data:", this.addressData); // ✅ اطبع البيانات المستلمة
    this.form = this.createAddressGroup(this.addressData);
    this.addressId = this.addressData.addressId;

  }

  createAddressGroup(address?: AddressResponse): FormGroup {
    return this.fb.group({
      doctorId: [address?.doctorId, Validators.required],
      addressId: [address?.addressId || null],  // ✅ fixed here
      addressName: [address?.addressName, Validators.required],
      city: [address?.city, Validators.required],
      region: [address?.region, Validators.required],
      postalCode: [address?.postalCode, Validators.required],
      street: [address?.street, Validators.required],
      buildingNumber: [address?.buildingNumber, Validators.required],
      phoneNumber: [address?.phoneNumber, Validators.required],
      longitude: [address?.longitude || 0],
      latitude: [address?.latitude || 0],
      country: [address?.country || 'Egypt'],
      isDeleted: [address?.isDeleted ?? false],
      availabilities: this.fb.array(
        (address?.availabilities || []).map((avail: AvailabilityResponse) =>
          this.fb.group(
            {
              isDeleted: [avail.isDeleted],
              doctorAvailabilityId: [avail.doctorAvailabilityId],
              addressId: [avail.addressId],
              dayOfWeek: [avail.dayOfWeek, Validators.required],
              startTime: [avail.startTime, Validators.required],
              endTime: [avail.endTime, Validators.required]
            },
            { validators: timeRangeValidator }
          )
        )
      )
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
          addressId: [this.addressId],
          dayOfWeek: [0, Validators.required],
          startTime: ['09:00:00', Validators.required],
          endTime: ['17:00:00', Validators.required]
        },
        { validators: timeRangeValidator }
      )
    );
  }

  save() {


    const payload: UpdateAddressRequest = this.form.value;
    console.log('Payload:', payload);
    console.log("doctorid", this.doctorId)
    console.log("doctorId from form:", this.form.get('doctorId')?.value);

    this.doctorService.updateAddress(payload).subscribe({
      next: () => {
        this.toast.success('Updated Address Successfully');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('❌ Update failed:', err);
      }
    });
  }

}




