import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabsKpisComponent } from './labs-kpis.component';

describe('LabsKpisComponent', () => {
  let component: LabsKpisComponent;
  let fixture: ComponentFixture<LabsKpisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabsKpisComponent]
    });
    fixture = TestBed.createComponent(LabsKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
