import { Component, OnInit } from '@angular/core';
import { AgmCoreModule, MouseEvent } from '@agm/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../../base/base-component';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage extends BaseComponent  implements OnInit {

  // google maps zoom level
  private zoom = 8;

  private marker: Marker;

  constructor(
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit() {
    this.marker = {
      lat: this.getCurrentStore().locationDetails.latitude,
      lng: this.getCurrentStore().locationDetails.longitude,
      label: ' ',
      draggable: true
    };
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
