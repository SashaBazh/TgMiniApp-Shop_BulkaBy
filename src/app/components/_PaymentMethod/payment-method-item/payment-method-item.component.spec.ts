import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodItemComponent } from './payment-method-item.component';

describe('PaymentMethodItemComponent', () => {
  let component: PaymentMethodItemComponent;
  let fixture: ComponentFixture<PaymentMethodItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
