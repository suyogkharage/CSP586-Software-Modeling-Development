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


import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


import { Place } from '../../place';
import { PlacesService } from '../../places.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};



@Component({
  selector: 'app-list-of-places',
  templateUrl: './list-of-places.component.html',
  styleUrls: ['./list-of-places.component.css']
})


export class ListOfPlacesComponent implements OnInit {

  uri = 'http://localhost:4000';

  places: Place[]=[];

  
  displayedColumns = ['name', 'display_phone', 'address1', 'is_closed', 'rating','review_count', 'Divvy'];

  constructor(private placesService: PlacesService, private router: Router, private http: HttpClient) { }

  
  ngOnInit() {

    this.fetchPlaces();

  }





  fetchPlaces() {
    this.placesService
      .getPlaces()
      .subscribe((data: Place[]) => {
        this.places = data;

      });
  }



  
  findStations(placeName) {

    for (var i = 0,len = this.places.length; i < len; i++) {

      if ( this.places[i].name === placeName ) { // strict equality test

          var place_selected =  this.places[i];

          break;
      }
    }


    this.placesService.findStations(placeName).subscribe(() => {
      this.router.navigate(['/list_of_stations/'+placeName]);
    });

  }



}
