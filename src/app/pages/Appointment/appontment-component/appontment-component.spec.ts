import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppontmentComponent } from './appontment-component';

describe('AppontmentComponent', () => {
  let component: AppontmentComponent;
  let fixture: ComponentFixture<AppontmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppontmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppontmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
