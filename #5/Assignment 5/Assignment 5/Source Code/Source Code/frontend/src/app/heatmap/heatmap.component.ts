import { Component, OnInit } from '@angular/core';
import { google } from '@agm/core/services/google-maps-types';
import { NgxHeatMapModule } from 'ngx-heatmap';
import { Input, ViewChild, NgZone} from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { Place } from 'src/app/place';
import { Station } from '../station';
import { PlacesService } from '../places.service';
import { Router } from '@angular/router';
import {ActivatedRoute} from "@angular/router";

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
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {

  markers: Station[];
  placeSelected: Place;

  constructor(private placesService: PlacesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getPlaceSelected();
  }

  getPlaceSelected() {
    this.placesService
      .getPlaceSelected()
      .subscribe((data: Place) => {
        this.placeSelected = data;

      });
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  public location:Location = {
  lat: 41.882607,
  lng: -87.643548,
  label: 'You are Here',
  zoom: 13
};
goBack(): void {
  this.router.navigate(['/list_of_stations/']);
}

}
