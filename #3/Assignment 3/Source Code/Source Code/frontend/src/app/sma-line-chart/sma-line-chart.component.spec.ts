import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmaLineChartComponent } from './sma-line-chart.component';

describe('SmaLineChartComponent', () => {
  let component: SmaLineChartComponent;
  let fixture: ComponentFixture<SmaLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmaLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmaLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
