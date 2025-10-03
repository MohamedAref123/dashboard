import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationError } from './validation-error';

describe('ValidationError', () => {
  let component: ValidationError;
  let fixture: ComponentFixture<ValidationError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
