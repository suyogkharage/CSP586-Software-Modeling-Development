import { TestBed } from '@angular/core/testing';

import { GetChartDataService } from './get-chart-data.service';

describe('GetChartDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetChartDataService = TestBed.get(GetChartDataService);
    expect(service).toBeTruthy();
  });
});
