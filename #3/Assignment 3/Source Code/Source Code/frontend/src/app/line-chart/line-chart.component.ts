import { Component,ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Chart } from '../chart';
import { GetChartDataService } from '../get-Chart-Data.service';
import { ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { delay } from 'rxjs/operators';


@Component({
  selector: 'app-line-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  chart: Chart[]=[];

 

 //@Input() stationList: ListOfStationsComponent;

  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>;
  private duration: number = 1;
  private title: any; 
  
  
  
  constructor(private getChartDataService: GetChartDataService,private route: ActivatedRoute,private router: Router,private location: Location ) {
        this.width = 900 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.title = 'Line Chart for last 1 hour(s)';
   }

  private id = this.route.snapshot.paramMap.get('stationName');
   


  ngOnInit() {
      this.fetchChartData();
      console.log("paratmeter is : "+ this.id);
  }

  findChartData(num){
    this.duration = num;
    if(num==7)
      this.title = 'Line Chart for last ' + this.duration + 'days';
    else
      this.title = 'Line Chart for last ' + this.duration + 'hour(s)'; 
      d3.selectAll("svg > *").remove();
    this.getChartDataService.findData(this.id,num).subscribe(() => {

      this.fetchChartData();
      //this.router.navigate(['/line_chart/'+this.id]);
    });
  }
  
   fetchChartData(){
      this.getChartDataService
        .getChartData()
        .subscribe(async (data: Chart[]) =>{
            this.chart = data;
            console.log(this.chart);
            this.initSvg();
            this.initAxis();
            this.drawAxis();
            this.drawLine();
            await this.delay(180000);
            d3.selectAll("svg > *").remove();
            this.getChartDataService.findData(this.id,this.duration).subscribe(() => {

              this.fetchChartData();
             
            });
            
            //this.fetchChartData();
        });

  }

   delay(ms: number) {
    //this.fetchChartData();
     
    console.log("In delay");
    return new Promise( resolve => setTimeout(resolve, ms) );

}

  private initSvg() {
    this.svg = d3.select('svg')
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
        

}

private initAxis() {
  this.x = d3Scale.scaleBand().range([0, this.width]).domain(this.chart.map((s) => s.lastCommunicationTime));
  this.y = d3Scale.scaleLinear().range([this.height, 0]);
  //this.x.domain(d3Array.extent(this.chart, (d) => d.lastCommunicationTime ));
  this.y.domain(d3Array.extent(this.chart, (d) => d.availableDocks ));
  //console.log(this.chart);
  


}

private drawAxis() {

  this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

  this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Available Docks');
      
}

private drawLine() {
  this.line = d3Shape.line()
      .x( (d: any) => this.x(d.lastCommunicationTime))
      .y( (d: any) => this.y(d.availableDocks) );

  this.svg.append('path')
      .datum(this.chart)
      .attr('class', 'line')
      .attr('stroke','red')
      .attr('d', this.line);
}

 
  goBack(): void {
    this.location.back();
  }


}
