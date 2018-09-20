import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base/base-component';
import { TranslateService } from '@ngx-translate/core';
import { AgmCoreModule, MouseEvent } from '@agm/core';
import { Utils } from '../../helpers/utils';
import { ModalController } from '@ionic/angular';
import { SearchLocationPage } from '../../pages/user/profile/search-location/search-location.page';

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

  @Input() addressPageClass = false;

  constructor(
    private translate: TranslateService,
    private modalController: ModalController
  ) {
    super();
    this.translate.use(Utils.getLanguageCode());
  }

  ngOnInit() {
    setTimeout(() => {
      this.marker = {
        lat: parseFloat(this.getCurrentStore().locationDetail.latitude),
        lng: parseFloat(this.getCurrentStore().locationDetail.longitude),
        label: ' ',
        draggable: true
      };
      console.log(this.getCurrentStore());
    }, 1000);
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


  locateMe() {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.marker.lng = +pos.coords.longitude;
        this.marker.lat = +pos.coords.latitude;
      });
    }
  }

  async openLocationModal(){
    const modal = await this.modalController.create({
      component: SearchLocationPage
    });
    return await modal.present();
  }

}

// Interface for type safety.
interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
