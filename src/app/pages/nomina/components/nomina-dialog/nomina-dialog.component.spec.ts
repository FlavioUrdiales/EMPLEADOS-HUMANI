import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominaDialogComponent } from './nomina-dialog.component';

describe('NominaDialogComponent', () => {
  let component: NominaDialogComponent;
  let fixture: ComponentFixture<NominaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NominaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NominaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
