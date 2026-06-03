import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionKpiComponent } from './mission-kpi.component';

describe('MissionKpiComponent', () => {
  let component: MissionKpiComponent;
  let fixture: ComponentFixture<MissionKpiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionKpiComponent]
    });
    fixture = TestBed.createComponent(MissionKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
