import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPatientHistoryComponent } from './view-patient-history-component';

describe('ViewPatientHistoryComponent', () => {
  let component: ViewPatientHistoryComponent;
  let fixture: ComponentFixture<ViewPatientHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPatientHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPatientHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
