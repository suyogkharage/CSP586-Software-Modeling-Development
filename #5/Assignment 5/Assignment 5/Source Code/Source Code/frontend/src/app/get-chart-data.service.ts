import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Place } from './place';
import { Chart } from './chart';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class GetChartDataService {
  
  
  findlastOneHourRecords(station,val) {
    console.log("in service:" + val);
    const data = {
      station : station,
      val : val
    };

    return this.http.post(`${this.uri}/stations/SMAchart`, data, httpOptions);

  }


  findPlaces(find, where) {
    const find_places_at = {
      find: find,
      where: where
    };

    return this.http.post(`${this.uri}/places/find`, find_places_at, httpOptions);

  }

  getPlaces() : Observable<Place[]> {
    return this.http.get<Place[]>(`${this.uri}/places`);
  }
  /*findlastOneHourRecordsSMA(station1,time){
    const sma_data = {
        station1: station1,
        time: time
    };

    return this.http.post(`${this.uri}/stations/SMAchart1`,sma_data,httpOptions);
  }*/
  
 
  
  

  uri = 'http://localhost:4000';
  uri1 = 'http://localhost:4001';
  constructor(private http: HttpClient) { }

  getChartData(): Observable<Chart[]> {
    console.log("in service2");
    return this.http.get<Chart[]>(`${this.uri}/chartData`);
    
  }

  getSMAChartData(): Observable<Chart[]> {
    console.log("in service4");
    return this.http.get<Chart[]>(`${this.uri}/SMAchartData`);
    
  }

  /*--------------------------------------------------------------- */
  /*--------------------------------------------------------------- */
    findData(stationName: any, duration: any) {
      console.log("in service1", stationName);
      const find_data = {
      stationName: stationName,
      duration: duration
      
    };
    return this.http.post(`${this.uri}/stations/chart`, find_data, httpOptions);
  }

  findSMAData(stationName: any, duration: any) {
    console.log("in service3", stationName);
    console.log("in service3", duration);
      const find_data = {
      stationName: stationName,
      duration: duration
      
    };
    return this.http.post(`${this.uri}/stations/SMAchart`, find_data, httpOptions);

  }


  
}
