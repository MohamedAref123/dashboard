import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { userResponse } from 'src/app/Models/Doctor/userResponse/userResponse';
import { DoctorService } from 'src/services/doctor.service';
import { ShardEnums, DaysOfWeek } from 'src/app/Models/shared/SharedClasses';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditAddressComponent } from '../edit-address-component/edit-address-component';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgFor, MatDialogModule, MatIcon],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  days = ShardEnums.getEnumOptions(DaysOfWeek);
  profileForm: FormGroup;
  doctorService = inject(DoctorService);
  fb = inject(FormBuilder);
  constructor() {
    this.profileForm = this.fb.group({
      doctorNameAR: [''],
      doctorNameEN: [''],
      email: [''],
      phoneNumber: [''],
      licenseNumber: [''],
      yearsOfExperience: [''],
      doctorSpecialist: [''],
      gender: [''],
      price: [0],
      descriptionAR: [''],
      descriptionEN: [''],
      education: [''],
      addresses: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.doctorService.getuser('EN').subscribe((res: userResponse) => {
      console.log('API Response:', res);
      this.patchForm(res);
    });
  }

  get addresses(): FormArray {
    return this.profileForm.get('addresses') as FormArray;
  }

  private createAddressGroup(): FormGroup {
    return this.fb.group({
      addressName: [''],
      country: [''],
      city: [''],
      region: [''],
      postalCode: [''],
      street: [''],
      buildingNumber: [''],
      phoneNumber: [''],
      longitude: [''],
      latitude: [''],
      isDeleted: [false],
      availabilities: this.fb.array([])
    });
  }

  private createAvailabilityGroup(): FormGroup {
    return this.fb.group({
      dayOfWeek: [''],
      startTime: [''],
      endTime: [''],
      isDeleted: [false]
    });
  }

  private patchForm(user: userResponse) {
    this.profileForm.patchValue({
      doctorNameAR: user.doctorNameAR,
      doctorNameEN: user.doctorNameEN,
      email: user.email,
      phoneNumber: user.phoneNumber,
      licenseNumber: user.licenseNumber,
      yearsOfExperience: user.yearsOfExperience,
      doctorSpecialist: user.doctorSpecialist,
      gender: user.gender,
      price: user.price,
      descriptionAR: user.descriptionAR,
      descriptionEN: user.descriptionEN,
      education: user.education
    });

    this.addresses.clear();
    user.addresses.forEach((addr) => {
      const addrGroup = this.createAddressGroup();
      addrGroup.patchValue({
        addressName: addr.addressName,
        country: addr.country,
        city: addr.city,
        region: addr.region,
        postalCode: addr.postalCode,
        street: addr.street,
        buildingNumber: addr.buildingNumber,
        phoneNumber: addr.phoneNumber,
        longitude: addr.longitude,
        latitude: addr.latitude,
        isDeleted: addr.isDeleted
      });

      const availArray = addrGroup.get('availabilities') as FormArray;
      addr.availabilities.forEach((av) => {
        const avGroup = this.createAvailabilityGroup();
        avGroup.patchValue({
          dayOfWeek: av.dayOfWeek,
          startTime: av.startTime,
          endTime: av.endTime,
          isDeleted: av.isDeleted
        });
        availArray.push(avGroup);
      });

      this.addresses.push(addrGroup);
    });
  }

  onSubmit() {
    console.log('Form Value:', this.profileForm.value);
  }
}
