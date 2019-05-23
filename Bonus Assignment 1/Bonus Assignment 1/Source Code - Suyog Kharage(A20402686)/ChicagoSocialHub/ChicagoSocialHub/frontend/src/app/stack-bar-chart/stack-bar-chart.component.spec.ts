import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackBarChartComponent } from './stack-bar-chart.component';

describe('StackBarChartComponent', () => {
  let component: StackBarChartComponent;
  let fixture: ComponentFixture<StackBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
