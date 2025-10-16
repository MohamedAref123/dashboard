import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { DoctorAddress, userResponse } from 'src/app/Models/Doctor/userResponse/userResponse';
import { DoctorService } from 'src/services/doctor.service';
import { ShardEnums, DaysOfWeek } from 'src/app/Models/shared/SharedClasses';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditAddressComponent } from '../edit-address-component/edit-address-component';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgFor, MatIcon, MatDialogModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  private dialog = inject(MatDialog);
  days = ShardEnums.getEnumOptions(DaysOfWeek);
  profileForm: FormGroup;
  doctorService = inject(DoctorService);
  fb = inject(FormBuilder);
  constructor() {}

  ngOnInit(): void {
    this.doctorService.getuser('EN').subscribe((res: userResponse) => {
      this.patchForm(res);
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
          longitude: [address.longitude],
          addressId: [address.addressId],
          latitude: [address.latitude],
          isDeleted: [address.isDeleted],
          availabilities: this.fb.array(
            (address.availabilities || []).map((av) =>
              this.fb.group({
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
    debugger;
    this.profileForm = this.fb.group({
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
      education: user.education,
      addresses: this.createAddressesArray(user.addresses)
    });
  }

  onUpdateAddress(addr: DoctorAddress) {
    const dialogRef = this.dialog.open(EditAddressComponent, {
      width: '800px',
      data: addr // ✅ Pass the whole address object
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  onSubmit() {
    console.log('Form Value:', this.profileForm.value);
  }
}
