import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsincatalogComponent } from './productsincatalog.component';

describe('ProductsincatalogComponent', () => {
  let component: ProductsincatalogComponent;
  let fixture: ComponentFixture<ProductsincatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsincatalogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsincatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
