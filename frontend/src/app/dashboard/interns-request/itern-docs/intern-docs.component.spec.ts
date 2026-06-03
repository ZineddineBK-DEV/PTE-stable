import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternDocsComponent } from './intern-docs.component';

describe('InternDocsComponent', () => {
  let component: InternDocsComponent;
  let fixture: ComponentFixture<InternDocsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternDocsComponent]
    });
    fixture = TestBed.createComponent(InternDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
