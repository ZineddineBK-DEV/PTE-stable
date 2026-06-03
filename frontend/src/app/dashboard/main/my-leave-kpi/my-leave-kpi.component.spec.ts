import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLeaveKpiComponent } from './my-leave-kpi.component';

describe('MyLeaveKpiComponent', () => {
  let component: MyLeaveKpiComponent;
  let fixture: ComponentFixture<MyLeaveKpiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyLeaveKpiComponent]
    });
    fixture = TestBed.createComponent(MyLeaveKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
