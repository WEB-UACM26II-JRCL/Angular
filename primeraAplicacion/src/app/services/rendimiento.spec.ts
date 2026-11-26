import { TestBed } from '@angular/core/testing';
import { Rendimiento } from './rendimiento';

describe('Rendimiento', () => {
  let service: Rendimiento;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Rendimiento);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
