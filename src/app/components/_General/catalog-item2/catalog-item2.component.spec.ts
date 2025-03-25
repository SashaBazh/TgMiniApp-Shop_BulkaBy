import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogItem2Component } from './catalog-item2.component';

describe('CatalogItemComponent', () => {
  let component: CatalogItem2Component;
  let fixture: ComponentFixture<CatalogItem2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogItem2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogItem2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
