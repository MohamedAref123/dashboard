
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DoctorSubUsersResponse, SubuserResponse } from 'src/app/Models/Responses/SubuserResponse';
import { DoctorClaims } from 'src/app/Models/shared/system-claims';
import { TableAction, GenericTable } from 'src/app/shared/generic-table/generic-table';
import { AuthService } from 'src/services/auth.service';


import { DoctorService } from 'src/services/doctor.service';
import { SubuserService } from 'src/services/subuser.service';
import { ToastService } from 'src/services/ToastService';


@Component({
  selector: 'app-subuser.component',
  imports: [ReactiveFormsModule, GenericTable, TranslateModule],
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
  doctorId: string | null = '';
  subuserlist: SubuserResponse[] = [];
  authService = inject(AuthService);
  authservice = inject(AuthService)

  headers = [
    { key: 'customName', label: 'SUBUSER.TABLE.CUSTOM_NAME' },
    { key: 'email', label: 'SUBUSER.TABLE.EMAIL' },
    { key: 'userName', label: 'SUBUSER.TABLE.USERNAME' },
    { key: 'isDeleted', label: 'SUBUSER.TABLE.DELETED' }
  ];


  actions: TableAction[] = [



  ];

  hasPermission(claim: DoctorClaims): boolean {
    return this.authService.has(claim);
  }


  pagination = {
    pageSize: 10,
    pageIndex: 0,
    totalRecords: 0
  };


  createactions() {
    if (this.hasPermission(DoctorClaims.UserClaims)) {
      this.actions.push({
        icon: 'admin_panel_settings',
        label: 'SUBUSER.ACTIONS.PERMISSION',
        color: 'primary',
        action: 'permission'
      });
    }

    if (this.hasPermission(DoctorClaims.UpdateSubUser)) {
      this.actions.push({
        icon: 'edit',
        label: 'SUBUSER.ACTIONS.EDIT',
        color: 'primary',
        action: 'edit'
      });
    }
  }


  ngOnInit(): void {

    this.createactions();

    this.doctorId = this.authservice.getDoctorId();

    if (this.doctorId) {
      this.loadsubuserlist();
    }


  }

  loadsubuserlist() {


    this.subuserservice.subuserList(this.doctorId || '', 'EN')
      .subscribe((res: DoctorSubUsersResponse) => {
        this.doctorname = res.doctorName;
        this.subuserlist = res.subUsers;
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
