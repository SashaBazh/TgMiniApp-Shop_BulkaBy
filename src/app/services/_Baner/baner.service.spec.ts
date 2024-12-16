import { TestBed } from '@angular/core/testing';

import { BanerService } from './baner.service';

describe('BanerService', () => {
  let service: BanerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BanerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
