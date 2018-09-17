import { Component, OnInit } from '@angular/core';
import { AgmCoreModule, MouseEvent } from '@agm/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  // google maps zoom level
  private zoom = 8;

  private marker = {
      lat: 17.4367635,                        //default location
      lng: 78.3671521,
      label: ' ',
      draggable: true
  };

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  markerDragEnd(m: Marker, $event: MouseEvent) {
    this.marker.lat = $event.coords.lat;
    this.marker.lng = $event.coords.lng;
    this.updateLocationAddress();
  }

  updateLocationAddress() {
    console.log('update location');
  }

  confirmLocation() {
    console.log('select location and proceed');
  }



}


// Interface for type safety.
interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
