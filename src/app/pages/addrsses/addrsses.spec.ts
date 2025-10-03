import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addrsses } from './addrsses';

describe('Addrsses', () => {
  let component: Addrsses;
  let fixture: ComponentFixture<Addrsses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addrsses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addrsses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
