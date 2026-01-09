import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissoinPageComponent } from './permissoin-page.component';

describe('PermissoinPageComponent', () => {
  let component: PermissoinPageComponent;
  let fixture: ComponentFixture<PermissoinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissoinPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissoinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
