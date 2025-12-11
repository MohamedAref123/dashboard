import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelDayAppointementComponent } from './cancel-day-appointement.component';

describe('CancelDayAppointementComponent', () => {
  let component: CancelDayAppointementComponent;
  let fixture: ComponentFixture<CancelDayAppointementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelDayAppointementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelDayAppointementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
