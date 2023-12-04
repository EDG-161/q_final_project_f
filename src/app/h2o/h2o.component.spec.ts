import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H2oComponent } from './h2o.component';

describe('H2oComponent', () => {
  let component: H2oComponent;
  let fixture: ComponentFixture<H2oComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [H2oComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(H2oComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
