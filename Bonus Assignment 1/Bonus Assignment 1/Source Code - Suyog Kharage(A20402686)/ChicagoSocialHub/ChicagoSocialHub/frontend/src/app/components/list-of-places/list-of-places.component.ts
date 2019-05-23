////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/// This file and the source code provided can be used only for   
/// the projects and assignments of this course

/// Last Edit by Dr. Atef Bader: 1/30/2019


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////



import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import {MatButtonModule} from '@angular/material/button';

import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


import { Place } from '../../place';
import { PlacesService } from '../../places.service';

import * as d3 from 'd3';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};



@Component({
  selector: 'app-list-of-places',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './list-of-places.component.html',
  styleUrls: ['./list-of-places.component.css']
})


export class ListOfPlacesComponent implements OnInit {

  uri = 'http://localhost:4000';

  private places: Place[]=[];

  private svg = d3.select('svg');
  private svgContainer = d3.select('#container');
  
 

  displayedColumns = ['name', 'display_phone', 'address1', 'is_closed', 'rating','review_count', 'Divvy'];

  constructor(private placesService: PlacesService, private router: Router, private http: HttpClient) {
  
   }

  
  ngOnInit() {

    this.places=this.fetchPlaces();
   
  }

  fetchPlaces() { 
    this.placesService
      .getPlaces()
      .subscribe((data: Place[]) => {
        this.places = data;
        console.log(this.places);
        
      });

      return this.places;
  }

  
  findStations(placeName) {

    for (var i = 0,len = this.places.length; i < len; i++) {

      if ( this.places[i].name === placeName ) { // strict equality test

          var place_selected =  this.places[i];

          break;
      }
    }

    this.placesService.findStations(placeName).subscribe(() => {
      this.router.navigate(['/list_of_stations']);
    });
  }

  


}
