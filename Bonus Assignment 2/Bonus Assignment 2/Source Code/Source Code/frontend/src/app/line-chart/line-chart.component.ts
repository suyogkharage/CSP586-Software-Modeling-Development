import { Component,ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { Chart } from '../chart';
import { GetChartDataService } from '../get-Chart-Data.service';
import { ActivatedRoute } from '@angular/router';
import {SMA} from '../sma';
import { Location } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { delay } from 'rxjs/operators';
import { Place } from '../place';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Component({
  selector: 'app-line-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  chart: Chart[]=[];
  avgChart: Chart[] = [];
  places: Place[]=[];
 
  marked = false;
  theCheckbox = false;

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
  sma: SMA[]=[];
  private durationForAvg:number;
  private sum: any;
  private key: number;
  private value: string;
  private val: any;

  constructor(private getChartDataService: GetChartDataService,private route: ActivatedRoute,private router: Router,private location: Location ) {
        this.width = 900 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.title = 'Line Chart for last 1 hour(s)';
   }

  private id = this.route.snapshot.paramMap.get('stationName');
   


  ngOnInit() {
      this.fetchChartData();
      //console.log("paratmeter is : "+ this.id);
  }

  findChartData(num){
    this.duration = num.value;
    if(num==7)
      this.title = 'Line Chart for last ' + this.duration + ' days';
    else
      this.title = 'Line Chart for last ' + this.duration + ' hour(s)'; 
      d3.selectAll("svg > *").remove();
    this.getChartDataService.findData(this.id,this.duration).subscribe(() => {

      this.fetchChartData();
      this.router.navigate(['/line_chart/'+this.id]);
    });
  }
  
   fetchChartData(){
      this.getChartDataService
        .getChartData()
        .subscribe(async (data: Chart[]) =>{
            this.chart = data;
            console.log("Chart data from ES");
            console.log(this.chart);
            //this.dataProcess(this.chart);


            
            this.initSvg();
            this.initAxis();
            this.drawAxis();
            this.drawLine(this.chart);
            /*await this.delay(180000);
            d3.selectAll("svg > *").remove();
            this.getChartDataService.findData(this.id,this.duration).subscribe(() => {

              this.fetchChartData();
             
            });
            */
            //this.fetchChartData();
        });

  }

  async toggleVisibility(e){
    this.val = e;
    this.duration = e;
    console.log(this.val);
    this.getChartDataService.findSMAData(this.id,this.val);
    //this.chart = []; 
    await this.delay(1500);
    this.getDataForSMA();
    
  }

  private getDataForSMA(){
    this.getChartDataService.getSMAChartData().subscribe(async (data: Chart[])=>{
      this.avgChart = data;
      console.log("SMA chart data");
      console.log(this.avgChart);
      await this.calculateAVG();
  
      this.initSMAAxis();
      this.drawSMALine();
    }); 
  }
  async calculateAVG(){
    this.sma= [];
    console.log("this.sma");
    console.log(this.sma);
    this.durationForAvg = 8;


      console.log(this.durationForAvg);  
      console.log('AvgChart data:');  
      console.log(this.avgChart);  

    for(let j=0; j< this.durationForAvg; j++)
    {
      this.sum=0;
      for(let i=j; i < j+this.durationForAvg; i++)
      {
        //console.log(i);
        this.sum = this.sum + this.avgChart[i].availableDocks;
        
      }
      this.key = this.sum/this.durationForAvg;
      this.value = this.chart[j].lastCommunicationTime;
      
      console.log('***' + this.key);         

      this.sma.push({average:this.key,lastCommunicationTime:this.value});

    }
    console.log("sma");
    console.log(this.sma);
     
   
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

private initSMAAxis() {
  this.x = d3Scale.scaleBand().range([0, this.width]).domain(this.chart.map((s) => s.lastCommunicationTime));
  this.y = d3Scale.scaleLinear().range([this.height, 0]);
  this.y.domain(d3Array.extent(this.sma, (d) => d.average ));
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

private drawLine(data: any[]) {

  //let keys = Object.getOwnPropertyNames(data[0]).slice(1);

  this.line = d3Shape.line()
      .x( (d: any) => this.x(d.lastCommunicationTime))
      .y( (d: any) => this.y(d.availableDocks) );

  this.svg.append('path')
      .datum(this.chart)
      .attr('class', 'line')
      .attr('stroke','red')
      .attr('d', this.line);

  /*let legend = this.svg.append('svg')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .attr('text-anchor', 'end')
        .selectAll('svg')
        .data(keys.slice().reverse())
        .enter().append('svg')
        .attr('transform', (d, i) => 'translate(0,' + i * 20 + ')');
*/
}

private drawSMALine() {
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

  goBackHome(): void {
    this.router.navigate(['/find/']);
  }

}
