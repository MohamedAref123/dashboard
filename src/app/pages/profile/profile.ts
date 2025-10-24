import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { DoctorAddress, userResponse } from 'src/app/Models/Doctor/userResponse/userResponse';
import { DoctorService } from 'src/services/doctor.service';
import { ShardEnums, DaysOfWeek, Genders } from 'src/app/Models/shared/SharedClasses';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditAddressComponent } from '../edit-address-component/edit-address-component';
import { ToastService } from 'src/services/ToastService';
import { Router } from '@angular/router';
import { arabicOnlyValidator, englishOnlyValidator, ValidationError } from 'src/app/shared/validation-error/validation-error';
import { MatLabel, MatOption, MatSelectModule } from "@angular/material/select";
import { InsurancesResponse } from 'src/app/Models/Responses/insurancesResponse';
import { InsuransesService } from 'src/services/insuranses.service';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, NgFor, MatIcon, MatDialogModule, ValidationError, MatLabel, MatOption],
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
  router = inject(Router)

  insurances: InsurancesResponse[] = [];

  insuranceService = inject(InsuransesService);
  selectedInsurance: InsurancesResponse = null;




  ngOnInit(): void {
    this.doctorService.getuser('EN').subscribe((res: userResponse) => {
      this.patchForm(res);
      console.log('Loaded user profile:', res);
    });

    this.loadInsurances();
  }

  loadInsurances(): void {
    this.insuranceService.getInsurances('en').subscribe({
      next: (data) => {
        this.insurances = data;

        // ✅ بعد تحميل التأمينات، نحدث التأمين الحالي من الـ form
        const currentId = this.profileForm?.get('insuranceId')?.value;
        if (currentId) {
          this.selectedInsurance = this.insurances.find(i => i.value === currentId);
        }
      },
      error: (err) => console.error('Failed to load insurances:', err)
    });
  }


  onInsuranceChange(selectedValue: string): void {
    const selected = this.insurances.find(i => i.value === selectedValue);
    if (selected) {
      this.selectedInsurance = selected;
    }
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
          longitude: [address.longitude],
          addressId: [address.addressId],
          latitude: [address.latitude],
          //isDeleted: [address.isDeleted],
          availabilities: this.fb.array(
            (address.availabilities || []).map((av) =>
              this.fb.group({
                addressId: [av.addressId],
                doctorAvailabilityId: [av.doctorAvailabilityId],
                dayOfWeek: [av.dayOfWeek],
                startTime: [av.startTime],
                endTime: [av.endTime],
                isDeleted: [av.isDeleted]
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
      insuranceId: user.insurance?.value || '', // ✅ استخدم value فقط
      doctorSpecialistId: user.doctorSpecialistId,
      doctorNameAR: user.doctorNameAR,
      doctorNameEN: user.doctorNameEN,
      email: user.email,
      phoneNumber: user.phoneNumber,
      licenseNumber: user.licenseNumber,
      yearsOfExperience: user.yearsOfExperience,
      doctorSpecialist: user.doctorSpecialist,
      gender: user.gender,
      price: user.price,
      descriptionAR: [user.descriptionAR, arabicOnlyValidator],
      descriptionEN: [user.descriptionEN, englishOnlyValidator],
      education: user.education,
      addresses: this.createAddressesArray(user.addresses)
    });
  }

  onUpdateAddress(addr: DoctorAddress) {
    const dialogRef = this.dialog.open(EditAddressComponent, {
      width: '800px',
      data: {
        ...addr,
        doctorId: this.profileForm.get('doctorId')?.value   // ✅ إضافة doctorId هنا
      }
    });

    dialogRef.afterClosed().subscribe((result) => { console.log('The dialog was closed', result); });
  }

  onSubmit() {

    console.log('Form Value:', this.profileForm.value);
    this.doctorService.updateDoctor(this.profileForm.value).subscribe({
      next: () => {
        this.toast.success('Profile updated successfully!');
      },
      error: (err) => {
        console.log('Error updating doctor:', err);
        this.toast.error('❌ Failed to update doctor');
      }
    });
  }

}
