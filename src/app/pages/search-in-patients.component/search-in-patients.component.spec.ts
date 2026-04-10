import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInPatientsComponent } from './search-in-patients.component';

describe('SearchInPatientsComponent', () => {
  let component: SearchInPatientsComponent;
  let fixture: ComponentFixture<SearchInPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInPatientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchInPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
