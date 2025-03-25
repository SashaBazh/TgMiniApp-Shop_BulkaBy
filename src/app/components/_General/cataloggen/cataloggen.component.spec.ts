import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CataloggenComponent } from './cataloggen.component';

describe('CataloggenComponent', () => {
  let component: CataloggenComponent;
  let fixture: ComponentFixture<CataloggenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CataloggenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CataloggenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
