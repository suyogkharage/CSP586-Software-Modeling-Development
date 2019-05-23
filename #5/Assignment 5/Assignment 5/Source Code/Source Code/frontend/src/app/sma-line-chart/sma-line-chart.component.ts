import { Component,ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetChartDataService } from '../get-Chart-Data.service';
import { Router } from '@angular/router';

import { Chart } from '../chart';
import {SMA} from '../sma';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { delay } from 'rxjs/operators';
import { summaryFileName } from '@angular/compiler/src/aot/util';

import { Location } from '@angular/common';

@Component({
  selector: 'app-sma-line-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sma-line-chart.component.html',
  styleUrls: ['./sma-line-chart.component.css']
})
export class SmaLineChartComponent implements OnInit {

  chart: Chart[]=[];
  tempChart: Chart[]=[];
  private tempAVG: any;
  private sum: any;
  sma: SMA[]=[];
  firstElement:any = [];
  private key: number;
  private value: string;
  private count = 0;

  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>;
  private duration: number = 60;
  private title: any; 
  private durationForAvg:number;

  constructor(private getChartDataService: GetChartDataService,private route: ActivatedRoute,private router: Router,private location: Location) { 
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.title = 'SMA Line Chart for last 1 hour';
  }

  private id = this.route.snapshot.paramMap.get('smaStationName');
  
  ngOnInit() {
   this.fetchLastOneHourRecord();

  }

  findChartData(num){
    this.duration = num;
    if(num==60)
      this.title = 'Line Chart for last 1 hour';
    else
      this.title = 'Line Chart for last 24 hours'; 
      d3.selectAll("svg > *").remove();
    this.getChartDataService.findlastOneHourRecords(this.id,num).subscribe(() => {

      this.fetchLastOneHourRecord();
      
    });
  }

  fetchLastOneHourRecord(){
    this.getChartDataService
      .getChartData()
      .subscribe(async (data: Chart[])=> {
        //this.chart.length = 0;
        this.chart = [];
        console.log(this.chart);
        this.chart= data;
        if(this.duration==1440 && this.chart.length < 1440)
        {
          alert("Insufficient Data");
        }
        else if(this.duration==60 && this.chart.length < 60){
          alert("Insufficient Data");
        }
        else{
        this.tempChart=data;

        

        //console.log('New chart data:' + this.chart[0].availableDocks);
        await this.calculateAVG();
        this.initSvg();
        this.initAxis();
        this.drawAxis();
        this.drawLine();
        //d3.selectAll("svg > *").remove();
        await this.delay(180000);
        this.getChartDataService.findlastOneHourRecords(this.id,this.duration).subscribe(() => {
  
          this.fetchLastOneHourRecord();
         
        });
      }
      })
    
  }

  async calculateAVG(){
    this.sma= [];
    if(this.duration == 60){
        this.durationForAvg = 30;
    }
    else
      this.durationForAvg = 720;


      console.log(this.durationForAvg);  
      console.log('chart data:');  
      console.log(this.chart);  

    for(let j=0; j< this.durationForAvg; j++)
    {
      this.sum=0;
      for(let i=j; i < j+this.durationForAvg; i++)
      {
        //console.log(i);
        this.sum = this.sum + this.chart[i].availableDocks;
        
      }
      this.key = this.sum/this.durationForAvg;
      //this.value = this.chart[j].lastCommunicationTime;
      
      console.log('***' + this.key);         

      //this.sma.push({average:this.key,lastCommunicationTime:this.value});

    }

      console.log(this.sma);
      
      

       
  }

  delay(ms: number) {
    console.log("In delay");
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  private initSvg() {
    this.svg = d3.select('svg')
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis() {
    this.x = d3Scale.scaleBand().range([0, this.width]).domain(this.sma.map((s) => s.lastCommunicationTime));
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    //this.x.domain(d3Array.extent(this.chart, (d) => d.lastCommunicationTime ));
    this.y.domain(d3Array.extent(this.sma, (d) => d.average ));
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
        .text('Moving Average');
  }

  private drawLine() {
    this.line = d3Shape.line()
        .x( (d: any) => this.x(d.lastCommunicationTime))
        .y( (d: any) => this.y(d.average) );
  
    this.svg.append('path')
        .datum(this.sma)
        .attr('class', 'line')
        .attr('stroke','red')
        .attr('d', this.line);
  }

  goBack(): void {
    this.location.back();
  }


}
