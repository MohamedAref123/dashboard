import { Component, inject, OnInit } from '@angular/core';
import { userResponse } from 'src/app/Models/Doctor/userResponse/userResponse';
import { PageChangeEvent, ReviewItem, ReviewResponse } from 'src/app/Models/Responses/ReviewResponse';
import { DoctorService } from 'src/services/doctor.service';
import { GenericTable, TableAction } from "src/app/shared/generic-table/generic-table";
import { NgFor, NgIf } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReviewsDialogComponent } from '../reviews-dialog.component/reviews-dialog.component';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-reviews.component',
  imports: [GenericTable, NgIf, TranslateModule, MatDialogModule, MatIcon, NgFor],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent implements OnInit {
  doctorService = inject(DoctorService);
  doctorId: string = '';
  translate = inject(TranslateService);
  dialog = inject(MatDialog);
  totalRating: number = 0;
  reviews: ReviewItem[] = [];

  pageSize = 10;
  pageIndex = 0;
  totalRecords = 0;

  headers = [
    { key: 'patientName', label: 'REVIEWS.PATIENT_NAME' },
    { key: 'rating', label: 'REVIEWS.RATING' },
    { key: 'comment', label: 'REVIEWS.COMMENT' }
  ];




  tableActions: TableAction[] = [
    { icon: 'visibility', label: 'BUTTONS.VIEW', color: 'primary', action: 'view' }
  ];


  reviewsPagination = {
    pageSize: 10,
    pageIndex: 0,
    totalRecords: 0
  };


  ngOnInit(): void {
    this.loadDoctor();
  }

  loadDoctor() {
    this.doctorService.getuser('EN').subscribe({
      next: (res: userResponse) => {
        this.doctorId = res.doctorId;
        this.loadReviews();
      },
      error: (err: unknown) => console.error('Error loading user:', err)
    });
  }

  loadReviews() {
    this.doctorService.reviews({
      doctorId: this.doctorId,
      pageSize: this.reviewsPagination.pageSize,
      pageIndex: this.reviewsPagination.pageIndex
    }).subscribe({
      next: (res: ReviewResponse) => {
        this.reviews = res.items;
        this.totalRating = res.totalRating; // ⭐ اجمع القيمة هنا
        this.reviewsPagination.pageSize = res.pageSize;
        this.reviewsPagination.pageIndex = res.pageIndex;
        this.reviewsPagination.totalRecords = res.totalRecords;
        console.log('Reviews loaded:', this.reviews);
      },

      error: (err: unknown) => console.error('Error loading reviews:', err)
    });
  }


  onPageChange(event: PageChangeEvent) {
    this.reviewsPagination.pageIndex = event.pageIndex;
    this.reviewsPagination.pageSize = event.pageSize;
    this.loadReviews();
  }

  handleAction(event: { row: ReviewItem; action: string }) {
    if (event.action === 'view') {
      this.dialog.open(ReviewsDialogComponent, {
        width: '800px',

        data: event.row
      });
    }
  }

}
