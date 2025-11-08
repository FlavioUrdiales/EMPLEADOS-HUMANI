import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuincenaComponent } from './quincena.component';

describe('QuincenaComponent', () => {
  let component: QuincenaComponent;
  let fixture: ComponentFixture<QuincenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuincenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuincenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
