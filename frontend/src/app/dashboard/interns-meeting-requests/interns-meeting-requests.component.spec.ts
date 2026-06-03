import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternsMeetingRequestsComponent } from './interns-meeting-requests.component';

describe('InternsMeetingRequestsComponent', () => {
  let component: InternsMeetingRequestsComponent;
  let fixture: ComponentFixture<InternsMeetingRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternsMeetingRequestsComponent]
    });
    fixture = TestBed.createComponent(InternsMeetingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
