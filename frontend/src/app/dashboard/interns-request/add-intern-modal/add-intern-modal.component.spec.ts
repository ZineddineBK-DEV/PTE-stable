import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInternModalComponent } from './add-intern-modal.component';

describe('AddInternModalComponent', () => {
  let component: AddInternModalComponent;
  let fixture: ComponentFixture<AddInternModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddInternModalComponent]
    });
    fixture = TestBed.createComponent(AddInternModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
