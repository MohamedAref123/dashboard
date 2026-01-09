import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubuserComponent } from './update-subuser.component';

describe('UpdateSubuserComponent', () => {
  let component: UpdateSubuserComponent;
  let fixture: ComponentFixture<UpdateSubuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSubuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSubuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
