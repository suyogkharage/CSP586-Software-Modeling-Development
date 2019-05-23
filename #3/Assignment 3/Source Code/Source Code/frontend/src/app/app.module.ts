////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/// This file and the source code provided can be used only for   
/// the projects and assignments of this course

/// Last Edit by Dr. Atef Bader: 1/30/2019


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////



import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';


import { MatToolbarModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatDividerModule, MatSnackBarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { PlacesService } from './places.service';
import { GetChartDataService } from './get-Chart-Data.service';

import { FindComponent } from './components/find/find.component';
import { ListOfPlacesComponent } from './components/list-of-places/list-of-places.component';
import { ListOfStationsComponent } from './components/list-of-stations/list-of-stations.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { SmaLineChartComponent } from './sma-line-chart/sma-line-chart.component';




const routes: Routes = [
  { path: 'find', component: FindComponent},
  { path: 'list_of_places', component: ListOfPlacesComponent},
  { path: 'list_of_stations', component: ListOfStationsComponent},
  { path: 'line_chart/:stationName', component: LineChartComponent},
  { path: 'SMA_line_chart/:smaStationName', component: SmaLineChartComponent},

  { path: '', redirectTo: 'find', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    FindComponent,
    ListOfPlacesComponent,
    ListOfStationsComponent,
    LineChartComponent,
    SmaLineChartComponent,    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule,

/////////////////////////////////////////////////////////////////////////////////////    
/////////////////////////// SETUP NEEDED ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

//  1. Create your API key from Google Developer Website
//  2. Install AGM package: npm install @agm/core @ng-bootstrap/ng-bootstrap --
//  3. Here is the URL for an online IDE for NG and TS that could be used to experiment
//  4. AGM live demo is loacted at this URL: https://stackblitz.com/edit/angular-google-maps-demo


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


    AgmCoreModule.forRoot({apiKey: 'YOUR_API_KEY'}),
    FormsModule,
    NgbModule
  ],

  providers: [PlacesService,GetChartDataService, GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
