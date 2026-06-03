import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMeetingInfoComponent } from './request-meeting-info.component';

describe('RequestMeetingInfoComponent', () => {
  let component: RequestMeetingInfoComponent;
  let fixture: ComponentFixture<RequestMeetingInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestMeetingInfoComponent]
    });
    fixture = TestBed.createComponent(RequestMeetingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
