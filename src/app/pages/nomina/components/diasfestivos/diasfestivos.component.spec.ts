import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiasfestivosComponent } from './diasfestivos.component';

describe('DiasfestivosComponent', () => {
  let component: DiasfestivosComponent;
  let fixture: ComponentFixture<DiasfestivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiasfestivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiasfestivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
