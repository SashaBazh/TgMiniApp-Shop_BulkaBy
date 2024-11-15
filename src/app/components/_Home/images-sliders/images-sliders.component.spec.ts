import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesSlidersComponent } from './images-sliders.component';

describe('ImagesSlidersComponent', () => {
  let component: ImagesSlidersComponent;
  let fixture: ComponentFixture<ImagesSlidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesSlidersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagesSlidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
