import { Component,ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { Chart } from '../chart';
import { Shared } from '../shared';
import { finalChart } from '../finalchart';
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
import * as d3ScaleChromatic from 'd3-scale-chromatic';


@Component({
  selector: 'app-line-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  chart: Chart[]=[];
  SMAChart1: Chart[]=[];
  SMAChart2: Chart[]=[];
  SMAChart24: Chart[]=[];
  sortedChart: Chart[]=[];
  semiFinalChart: Chart[]=[];
  finalChart: finalChart[]=[];
  finalSMAChart: finalChart[]=[];
  avgChart: Chart[] = [];
  places: Place[]=[];
  shared: Shared[]=[];
  
  


  marked = false;
  theCheckbox = false;

 //@Input() stationList: ListOfStationsComponent;

  /*private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>;
  */private line1: d3Shape.Line<[number, number]>;
  private duration: number = 1;
  private title: any; 
  sma: SMA[]=[];
  private durationForAvg:number;
  private sum: any;
  private key: number;
  private value: string;
  private val: any;
  private AvgArray = [];
  private current_hour: any;
  public hourToggle: boolean = false;
  public hourSMAToggle: boolean = true;



  data: any;

    svg: any;
    margin = {top: 20, right: 80, bottom: 30, left: 50};
    g: any;
    width: number;
    height: number;
    x;
    y;
    z;
    line;

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
    if(num.value==1)
      this.title = 'Line Chart for last 1 hour';
    if(num.value==24)
      this.title = 'Line Chart for last 24 hours';
    if(num.value==7)
      this.title = 'Line Chart for last 7 days';   
      d3.selectAll("svg > *").remove();
    this.shared = [];
    this.getChartDataService.findData(this.id,this.duration).subscribe(() => {

      this.fetchChartData();
      //this.router.navigate(['/line_chart/'+this.id]);
    });
  }
  
   fetchChartData(){
      this.getChartDataService
        .getChartData()
        .subscribe(async (data: Chart[]) =>{
            this.chart = data;
            


            console.log("Chart data from ES");
            console.log(this.chart);

            //this.dataProcess();
            this.sortedChart = this.chart.sort((a: Chart, b: Chart) => {
              if(a.lastCommunicationTime > b.lastCommunicationTime){
                return 1;
              }
              if(a.lastCommunicationTime < b.lastCommunicationTime){
                return -1;
              }
              return 0;
          });
          if(this.duration==1)
            {
              this.SMAChart1 = this.chart;
            }
            if(this.duration == 24)
            {
              this.SMAChart24 =this.chart;  
            }

            console.log("Sorted Chart data");
            console.log(this.sortedChart);
            this.setGranularity();
//            this.drawLineChart();
            this.drawSMALineChart();
            
            /*await this.delay(180000);
            d3.selectAll("svg > *").remove();
            this.getChartDataService.findData(this.id,this.duration).subscribe(() => {

              this.fetchChartData();
             
            });
            */
            //this.fetchChartData();
        });
  }

  setGranularity(){

/*-------------------------Set granularity for last one hour-------------------- */
  if(this.duration==1){

    this.finalChart = [];
    var j = 0;
    for(var i=0; i<30; i++){
      this.finalChart.push({availableDocks:this.chart[i].availableDocks,lastCommunicationTime:j})
      j = j+2;
    }
    console.log('granulated chart 1');
    console.log(this.finalChart);
    this.shared.push({id:"normal",values:this.finalChart});
  }


/*-------------------------Set granularity for last 24 hour-------------------- */
  if(this.duration==24)
  {
    this.finalChart = [];
    var count =0;
    var sum = 0;
    var avg = 0; 

    for(var k=0; k<720; k++){
      this.semiFinalChart.push({availableDocks:this.chart[k].availableDocks,lastCommunicationTime:this.chart[k].lastCommunicationTime})
    }
    console.log("semi final chart: ", this.semiFinalChart);

    for(var i=0; i<this.semiFinalChart.length;i++){
      sum = sum + this.semiFinalChart[i].availableDocks;
      if((i+1)%30==0){
        sum = sum + this.semiFinalChart[i].availableDocks;
        avg = Math.floor(sum/30);
        this.finalChart.push({availableDocks:avg,lastCommunicationTime:count});
        count++;
        sum = 0;
        avg = 0;
      }
    }

    console.log('Granulated chart 24');
    console.log(this.finalChart);
    this.shared.push({id:"normal",values:this.finalChart});
    
  }



/*----------------------------------------------------------------------------- */
  }

  async toggleVisibility_1(e){
    if(e==1){
      this.hourToggle = true;
      this.val = e;
      this.duration = e;
      console.log(this.val);
      //await this.getChartDataService.findSMAData(this.id,this.val);
      //this.chart = []; 
      //await this.delay(1500);
      console.log("In toggleVisibility:", this.SMAChart1);
      
      
     
      this.calculateAVG(this.SMAChart1);
      this.drawSMALineChart();

    }
    if(e==24){
      this.hourSMAToggle = false;
      this.calculateAVG(this.SMAChart24);
      this.drawSMALineChart();
    }
    
  }

  calculateAVG(SMAChart: Chart[]){
    this.sma= [];
    console.log("this.sma");
    console.log(this.sma);
    if(this.duration==1)
      this.durationForAvg = 30;
    if(this.duration==24)
      this.durationForAvg=720;

      console.log(this.durationForAvg);  
      console.log('AvgChart data:');  
      console.log(SMAChart);  

    for(let j=0; j< this.durationForAvg; j++)
    {
      this.sum=0;
      for(let i=j; i < j+this.durationForAvg; i++)
      {
        //console.log(i);
        this.sum = this.sum + SMAChart[i].availableDocks;
        
      }
      this.key = Math.floor(this.sum/this.durationForAvg);
      //this.value = this.chart[j].lastCommunicationTime;
      
      console.log('***' + this.key);         

      this.sma.push({availableDocks:this.key,lastCommunicationTime:this.chart[j].lastCommunicationTime});

    }


    console.log("sma");
    var sum= 0;
    var avg = 0;
    var count = 0;

    if(this.duration==24){
        this.semiFinalChart= [];
        this.finalSMAChart = [];
        for(var k=0; k<720; k++){
          this.semiFinalChart.push({availableDocks:this.sma[k].availableDocks,lastCommunicationTime:this.sma[k].lastCommunicationTime})
        }

        for(var i=0; i<this.semiFinalChart.length;i++){
          sum = sum + this.semiFinalChart[i].availableDocks;
          if((i+1)%30==0){
            sum = sum + this.semiFinalChart[i].availableDocks;
            avg = Math.floor(sum/30);
            this.finalSMAChart.push({availableDocks:avg,lastCommunicationTime:count});
            count++;
            sum = 0;
            avg = 0;
          }
        }
        console.log("new condition:", this.finalSMAChart);
        this.shared.push({id:"average",values: this.finalSMAChart});
    }  
    else{
        var k = 0;
        this.finalSMAChart = [];
        for(var i=0; i< this.sma.length; i++){
          this.finalSMAChart.push({availableDocks:this.sma[i].availableDocks,lastCommunicationTime:k});
          k = k+2;
        }    
        console.log(this.finalSMAChart);
        this.shared.push({id:"average",values:this.finalSMAChart});
    }      
      
    


    
   
  }

   delay(ms: number) {
    //this.fetchChartData();
     
    console.log("In delay");
    return new Promise( resolve => setTimeout(resolve, ms) );

}


  private drawSMALineChart(){
    console.log("shared data: ",this.shared);
    this.data = this.shared.map((v) => v.values.map((v) => v.lastCommunicationTime ))[0];

  
    this.svg = d3.select('svg');

    this.width = this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = this.svg.attr('height') - this.margin.top - this.margin.bottom;

    this.g = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10);

    this.line = d3Shape.line()
        .curve(d3Shape.curveBasis)
        .x( (d: any) => this.x(d.lastCommunicationTime) )
        .y( (d: any) => this.y(d.availableDocks) );

    this.x.domain(d3Array.extent(this.data, (d) => d ));

    this.y.domain([
        0,
        d3Array.max(this.shared, function(c) { return d3Array.max(c.values, function(d) { return d.availableDocks; }); })
    ]);

    this.z.domain(this.shared.map(function(c) { return c.id; }));


    this.g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + this.height + ')')
    .call(d3Axis.axisBottom(this.x));

this.g.append('g')
    .attr('class', 'axis axis--y')
    .call(d3Axis.axisLeft(this.y))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('fill', '#000')
    .text('Available Docks');

    let city = this.g.selectAll('.city')
    .data(this.shared)
    .enter().append('g')
    .attr('class', 'city');

city.append('path')
    .attr('class', 'line')
    .attr('d', (d) => this.line(d.values) )
    .style('stroke', (d) => this.z(d.id) );

city.append('text')
    .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
    .attr('transform', (d) => 'translate(' + this.x(d.value.lastCommunicationTime) + ',' + this.y(d.value.availableDocks) + ')' )
    .attr('x', 3)
    .attr('dy', '0.35em')
    .style('font', '10px sans-serif')
    .text(function(d) { return d.id; });
  }




 
  goBack(): void {
    this.location.back();
  }

  goBackHome(): void {
    this.router.navigate(['/find/']);
  }

}
