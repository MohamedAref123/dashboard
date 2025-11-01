import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsDialogComponent } from './reviews-dialog.component';

describe('ReviewsDialogComponent', () => {
  let component: ReviewsDialogComponent;
  let fixture: ComponentFixture<ReviewsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
