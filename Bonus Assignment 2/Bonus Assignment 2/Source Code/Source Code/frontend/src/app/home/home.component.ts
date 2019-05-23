import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { PlacesService } from '../places.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  createForm: FormGroup;
  hintColor;


  constructor(private placesService: PlacesService, private fb: FormBuilder, private router: Router) {
   
  }

  goToFind(): void {
    this.router.navigate(['/find/']);
  }

  goToHeatmap(): void{
    this.router.navigate(['/home/']);
  }
  ngOnInit() {
  }


}
