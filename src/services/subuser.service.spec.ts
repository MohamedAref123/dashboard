import { TestBed } from '@angular/core/testing';

import { SubuserService } from './subuser.service';

describe('SubuserService', () => {
  let service: SubuserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubuserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
