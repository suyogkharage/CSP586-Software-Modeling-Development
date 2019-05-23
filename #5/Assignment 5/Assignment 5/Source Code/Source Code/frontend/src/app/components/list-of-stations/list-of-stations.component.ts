////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/// This file and the source code provided can be used only for   
/// the projects and assignments of this course

/// Last Edit by Dr. Atef Bader: 1/30/2019


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////




import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import {ActivatedRoute} from "@angular/router";

import { Station } from '../../station';
import { PlacesService } from '../../places.service';
import { GetChartDataService } from '../../get-Chart-Data.service';

import { Input, ViewChild, NgZone} from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { Place } from 'src/app/place';
import { google } from '@agm/core/services/google-maps-types';




interface Location {
  lat: number;
  lng: number;
  zoom: number;
  address_level_1?:string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  label: string;
}



@Component({
  selector: 'app-list-of-stations',
  templateUrl: './list-of-stations.component.html',
  styleUrls: ['./list-of-stations.component.css']
})
export class ListOfStationsComponent implements OnInit {

  

  stations: Station[];
  markers: Station[];
  placeSelected: Place;

  

  displayedColumns = ['id', 'stationName', 'availableBikes', 'availableDocks', 'is_renting', 'lastCommunicationTime', 'latitude',  'longitude', 'status', 'totalDocks', 'totalDocks1'];


  icon = {
    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    scaledSize: {
      width: 60,
      height: 60
    }
  }



  constructor(private placesService: PlacesService, private getChartDataService: GetChartDataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.fetchStations();
    this.getPlaceSelected();
 }

  fetchStations() {
    this.placesService
      .getStations()
      .subscribe((data: Station[]) => {
        this.stations = data;
        this.markers = data;

      });
  }


  getPlaceSelected() {
    this.placesService
      .getPlaceSelected()
      .subscribe((data: Place) => {
        this.placeSelected = data;

      });
  }


  lineChart(stationName) {

    var name = stationName;

    for (var i = 0,len = this.stations.length; i < len; i++) {
  
      if ( this.stations[i].stationName === stationName ) { // strict equality test
  
          var station_selected =  this.stations[i];
  
          break;
      }
    }
  
      
      this.getChartDataService.findData(stationName,1).subscribe(() => {
      
      this.router.navigate(['/line_chart/'+stationName]);
    });
  
  }

  /*SMAlineChart(stationName){
    var name = stationName;

    for (var i = 0,len = this.stations.length; i < len; i++) {
  
      if ( this.stations[i].stationName === stationName ) { // strict equality test
  
          var station_selected =  this.stations[i];
  
          break;
      }
    }

    this.getChartDataService.findlastOneHourRecords(stationName,60).subscribe(() =>{
      this.router.navigate(['/SMA_line_chart/'+stationName]);      
    });

  }*/



/*  lineChart(stationName: string){
    console.log("In cosole log: "+stationName);

    // call getChartData service
    this.getChartDataService


    this.router.navigate(['/line_chart']);
  }  

*/

clickedMarker(label: string, index: number) {
  console.log(`clicked the marker: ${label || index}`)
}


circleRadius:number = 3000; // km

public location:Location = {
  lat: 41.882607,
  lng: -87.643548,
  label: 'You are Here',
  zoom: 13
};

goBack(): void {
  this.router.navigate(['/list_of_places/']);
}


}



