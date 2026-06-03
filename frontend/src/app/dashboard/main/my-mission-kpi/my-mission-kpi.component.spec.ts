import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMissionKpiComponent } from './my-mission-kpi.component';

describe('MyMissionKpiComponent', () => {
  let component: MyMissionKpiComponent;
  let fixture: ComponentFixture<MyMissionKpiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyMissionKpiComponent]
    });
    fixture = TestBed.createComponent(MyMissionKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
