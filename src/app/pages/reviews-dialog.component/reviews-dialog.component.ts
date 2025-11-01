import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReviewItem } from 'src/app/Models/Responses/ReviewResponse';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-reviews-dialog.component',
  imports: [MatIcon, TranslateModule, NgFor, CommonModule,],
  templateUrl: './reviews-dialog.component.html',
  styleUrl: './reviews-dialog.component.scss'
})
export class ReviewsDialogComponent {

  dialogRef = inject(MatDialogRef<ReviewsDialogComponent>);
  data = inject(MAT_DIALOG_DATA) as ReviewItem;
  translate = inject(TranslateService);
  get isRtl() {
    return this.translate.currentLang === 'ar';
  }


  createStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

}
