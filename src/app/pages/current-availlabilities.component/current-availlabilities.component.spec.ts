import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentAvaillabilitiesComponent } from './current-availlabilities.component';

describe('CurrentAvaillabilitiesComponent', () => {
  let component: CurrentAvaillabilitiesComponent;
  let fixture: ComponentFixture<CurrentAvaillabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentAvaillabilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentAvaillabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
