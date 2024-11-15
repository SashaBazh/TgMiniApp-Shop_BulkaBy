import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewJewelryComponent } from './new-jewelry.component';

describe('NewJewelryComponent', () => {
  let component: NewJewelryComponent;
  let fixture: ComponentFixture<NewJewelryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewJewelryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewJewelryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
