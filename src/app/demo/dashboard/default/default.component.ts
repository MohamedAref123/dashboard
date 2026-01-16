// Angular Import
import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PayrollItem } from 'src/app/Models/Responses/PayrollResponse';
import { DoctorClaims } from 'src/app/Models/shared/system-claims';



// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from 'src/services/auth.service';
import { PayrollService } from 'src/services/payroll.service';

@Component({
  selector: 'app-default',
  imports: [SharedModule, TranslateModule, NgIf],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  payrolForm!: FormGroup;
  fb = inject(FormBuilder);
  payrollService = inject(PayrollService);
  payrollItems: PayrollItem[] = [];
  totalPayroll: number = 0;
  totalRecords: number = 0;
  authService = inject(AuthService)
  DoctorClaims = DoctorClaims;
  ngOnInit(): void {
    const today = new Date();

    this.payrolForm = this.fb.group({ // ✅ الاسم الجديد
      pageSize: [20, [Validators.required, Validators.min(1)]],
      pageIndex: [0, [Validators.required, Validators.min(0)]],
      fromDate: [today.toISOString().split('T')[0], Validators.required], // اليوم فقط
      toDate: [today.toISOString().split('T')[0], Validators.required]
    });

    // البحث تلقائياً عند تحميل الصفحة
    this.search();
  }

  hasPermission(claim: DoctorClaims): boolean {
    return this.authService.has(claim);
  }


  search(): void {
    if (this.payrolForm.invalid) return;

    const formValue = { ...this.payrolForm.value };
    formValue.fromDate = new Date(formValue.fromDate).toISOString();
    formValue.toDate = new Date(formValue.toDate).toISOString();

    this.payrollService.getDoctorAppointments(formValue).subscribe({
      next: res => {
        this.payrollItems = res.items;
        this.totalPayroll = res.totalPayroll;
        this.totalRecords = res.totalRecords;
      },
      error: err => console.error(err)
    });
  }

  getCategoryKey(category: number): string {
    switch (category) {
      case 0: return 'CONSULTATION';
      case 1: return 'FOLLOW_UP';
      case 2: return 'OPERATION';
      default: return 'UNKNOWN';
    }
  }



  // public method
  ListGroup = [
    {
      name: 'Bajaj Finery',
      profit: '10% Profit',
      invest: '$1839.00',
      bgColor: 'bg-light-success',
      icon: 'ti ti-chevron-up',
      color: 'text-success'
    },
    {
      name: 'TTML',
      profit: '10% Loss',
      invest: '$100.00',
      bgColor: 'bg-light-danger',
      icon: 'ti ti-chevron-down',
      color: 'text-danger'
    },
    {
      name: 'Reliance',
      profit: '10% Profit',
      invest: '$200.00',
      bgColor: 'bg-light-success',
      icon: 'ti ti-chevron-up',
      color: 'text-success'
    },
    {
      name: 'ATGL',
      profit: '10% Loss',
      invest: '$189.00',
      bgColor: 'bg-light-danger',
      icon: 'ti ti-chevron-down',
      color: 'text-danger'
    },
    {
      name: 'Stolon',
      profit: '10% Profit',
      invest: '$210.00',
      bgColor: 'bg-light-success',
      icon: 'ti ti-chevron-up',
      color: 'text-success',
      space: 'pb-0'
    }
  ];

  profileCard = [
    {
      style: 'bg-primary-dark text-white',
      background: 'bg-primary',
      value: '$203k',
      text: 'Net Profit',
      color: 'text-white',
      value_color: 'text-white'
    },
    {
      background: 'bg-warning',
      avatar_background: 'bg-light-warning',
      value: '$550K',
      text: 'Total Revenue',
      color: 'text-warning'
    }
  ];



}
