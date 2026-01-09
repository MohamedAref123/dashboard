import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { updateusbuserRequest } from 'src/app/Models/Requests/update-subuserRequest';
import { SubuserResponse } from 'src/app/Models/Responses/SubuserResponse';
import { passwordMatchValidator } from 'src/app/shared/validation-error/validation-error';
import { SubuserService } from 'src/services/subuser.service';
import { ToastService } from 'src/services/ToastService';

@Component({
  selector: 'app-update-subuser.component',
  imports: [ReactiveFormsModule, NgIf, TranslateModule],
  templateUrl: './update-subuser.component.html',
  styleUrl: './update-subuser.component.scss'
})
export class UpdateSubuserComponent implements OnInit {

  subuserservice = inject(SubuserService)
  route = inject(ActivatedRoute)
  toast = inject(ToastService)
  subId: string
  doctorId: string
  subuser: SubuserResponse
  subUserForm!: FormGroup;
  fb = inject(FormBuilder)

  showPassword = false;
  showConfirmPassword = false;

  ngOnInit(): void {

    this.subUserForm = this.fb.group({
      id: ['', Validators.required],
      customName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [null],
      confirmedPassword: [null],
      parentDoctorId: ['', Validators.required]
    }, { validators: passwordMatchValidator });



    this.getsubuser()
  }




  getsubuser() {
    this.subId = this.route.snapshot.paramMap.get('subuserId') ?? '';
    this.doctorId = this.route.snapshot.paramMap.get('doctorId');

    this.subuserservice.getsubuser(this.subId).subscribe({
      next: (data) => {
        this.subuser = data;
        console.log(data);

        // 3️⃣ اربط الداتا بالفورم
        this.subUserForm.patchValue({
          id: data.id,
          customName: data.customName,
          email: data.email,
          parentDoctorId: data.parentDoctorId   // 🔥 مهم جدًا
        });

      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  submit() {


    const model = this.subUserForm.value as updateusbuserRequest;

    console.log('Payload to API:', model);

    this.subuserservice.updateusbuser(model).subscribe({
      next: (res) => {
        console.log('Updated', res)
        this.toast.success('sub user is updated successfully')
      },
      error: err => console.error('API Error', err)
    });
  }




  goback() {
    window.history.back()
  }



}
