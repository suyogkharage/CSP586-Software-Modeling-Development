import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class GetChartDataService {
  
  
  findlastOneHourRecords(station,time1) {
    const data = {
      station : station,
      time1 : time1
    };

    return this.http.post(`${this.uri}/stations/SMAchart`, data, httpOptions);

  }

  /*findlastOneHourRecordsSMA(station1,time){
    const sma_data = {
        station1: station1,
        time: time
    };

    return this.http.post(`${this.uri}/stations/SMAchart1`,sma_data,httpOptions);
  }*/
  
 
  
  

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getChartData() {
    return this.http.get(`${this.uri}/chartData`);
    
  }


  findData(stationName,param) {
    const find_data = {
      stationName: stationName,
      param: param
    };

    return this.http.post(`${this.uri}/stations/chart`, find_data, httpOptions);

  }


  
}
