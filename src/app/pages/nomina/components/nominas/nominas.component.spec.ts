import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominasComponent } from './nominas.component';

describe('NominasComponent', () => {
  let component: NominasComponent;
  let fixture: ComponentFixture<NominasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NominasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NominasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
