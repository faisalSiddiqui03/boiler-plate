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
  zoom = 8;
  agmMarkerSrc: string;
  marker: Marker;
  location: any;

  constructor(
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit() {
    this.marker = {
      lat: Number(this.getCurrentStore().locationDetail.latitude),
      lng: Number(this.getCurrentStore().locationDetail.longitude),
      label: ' ',
      draggable: true
    };
  }

  markerDragEnd(m: Marker, $event: MouseEvent) {
    this.marker.lat = Number($event.coords.lat);
    this.marker.lng = Number($event.coords.lng);
    this.updateLocationAddress();
  }

  updateLocationAddress() {
    console.log('update location');
  }

  confirmLocation() {
    console.log('select location and proceed');
  }

  dismiss() {

  }

}


// Interface for type safety.
interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
