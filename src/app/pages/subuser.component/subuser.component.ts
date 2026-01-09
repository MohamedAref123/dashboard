
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { ActivatedRoute, Router } from '@angular/router';

import { DoctorSubUsersResponse, SubuserResponse } from 'src/app/Models/Responses/SubuserResponse';
import { TableAction, GenericTable } from 'src/app/shared/generic-table/generic-table';
import { AuthService } from 'src/services/auth.service';


import { DoctorService } from 'src/services/doctor.service';
import { SubuserService } from 'src/services/subuser.service';
import { ToastService } from 'src/services/ToastService';

@Component({
  selector: 'app-subuser.component',
  imports: [ReactiveFormsModule, GenericTable],
  templateUrl: './subuser.component.html',
  styleUrl: './subuser.component.scss'
})
export class SubuserComponent implements OnInit {

  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  doctorservice = inject(DoctorService);
  toast = inject(ToastService);
  subuserservice = inject(SubuserService);
  router = inject(Router)
  subuserForm: FormGroup
  showPassword = false;
  showConfirmPassword = false;
  doctorname: string = '';
  doctorId: string = '';
  subuserlist: SubuserResponse[] = [];

  authservice = inject(AuthService)

  headers = [
    { key: 'customName', label: 'custom Name' },
    { key: 'email', label: 'Email' },
    { key: 'userName', label: 'userName' },
    { key: 'isDeleted', label: 'Deleted' },
  ];

  actions: TableAction[] = [
    { icon: 'edit', label: 'Edit', color: 'primary', action: 'edit' },
    { icon: 'permission', label: 'permission', color: 'primary', action: 'permission' },
    // { icon: 'delete', label: 'Delete', color: 'warn', action: 'delete' },
  ];



  pagination = {
    pageSize: 10,
    pageIndex: 0,
    totalRecords: 0
  };




  ngOnInit(): void {

    this.doctorId = this.authservice.getDoctorId()

    if (this.doctorId) {
      this.loadsubuserlist();
    }
  }

  loadsubuserlist() {


    this.subuserservice.subuserList(this.doctorId || '', 'EN')
      .subscribe((res: DoctorSubUsersResponse) => {
        this.doctorname = res.doctorName;   // ✅ اسم الدكتور لوحده
        this.subuserlist = res.subUsers;   // ✅ Array of items
      });

  }



  handleAction(event: { row: SubuserResponse; action: string }) {

    if (event.action === 'edit') {
      this.router.navigate(['/update-Sub-user', event.row.id])

    }

    if (event.action === 'permission') {
      this.router.navigate(['/user-permission', event.row.id])
      //asd
    }

  }

  onPageChange(event: PageEvent) {
    this.subuserForm.patchValue({
      pageSize: event.pageSize,
      pageIndex: event.pageIndex
    });
  }


  goback() {
    window.history.back();
  }

}
