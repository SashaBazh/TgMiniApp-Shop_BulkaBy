import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadersettingsComponent } from './headersettings.component';

describe('HeadersettingsComponent', () => {
  let component: HeadersettingsComponent;
  let fixture: ComponentFixture<HeadersettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadersettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadersettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
