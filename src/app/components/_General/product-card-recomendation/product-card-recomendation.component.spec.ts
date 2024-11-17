import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardRecomendationComponent } from './product-card-recomendation.component';

describe('ProductCardRecomendationComponent', () => {
  let component: ProductCardRecomendationComponent;
  let fixture: ComponentFixture<ProductCardRecomendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardRecomendationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardRecomendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
