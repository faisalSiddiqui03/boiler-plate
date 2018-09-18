import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base-component';
import { TranslateService } from '@ngx-translate/core';
import { AgmCoreModule, MouseEvent } from '@agm/core';
import { Utils } from '../../helpers/utils';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.scss']
})
export class LocationMapComponent extends BaseComponent implements OnInit {

  // google maps zoom level
  zoom = 8;
  marker: Marker;
  agmMarkerSrc = 'assets/imgs/location-pin.png';

  constructor(
    private translate: TranslateService
  ) {
    super();
    this.translate.use(Utils.getLanguageCode());
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
