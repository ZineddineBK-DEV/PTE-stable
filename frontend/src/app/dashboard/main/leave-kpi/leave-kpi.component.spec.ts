import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveKPIComponent } from './leave-kpi.component';

describe('LeaveKPIComponent', () => {
  let component: LeaveKPIComponent;
  let fixture: ComponentFixture<LeaveKPIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveKPIComponent]
    });
    fixture = TestBed.createComponent(LeaveKPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
