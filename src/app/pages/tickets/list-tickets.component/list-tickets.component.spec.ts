import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTicketsComponent } from './list-tickets.component';

describe('ListTicketsComponent', () => {
  let component: ListTicketsComponent;
  let fixture: ComponentFixture<ListTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
