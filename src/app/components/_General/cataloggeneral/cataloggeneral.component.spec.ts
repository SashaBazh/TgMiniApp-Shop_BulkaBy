import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CataloggeneralComponent } from './cataloggeneral.component';

describe('CataloggeneralComponent', () => {
  let component: CataloggeneralComponent;
  let fixture: ComponentFixture<CataloggeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CataloggeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CataloggeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
