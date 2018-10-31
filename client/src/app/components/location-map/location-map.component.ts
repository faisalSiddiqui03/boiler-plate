import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import { TranslateService } from '@capillarytech/pwa-framework';
import { AgmCoreModule, MouseEvent, MarkerManager } from '@agm/core';
import { ModalController } from '@ionic/angular';
import { SearchLocationPage } from '../../pages/user/profile/search-location/search-location.page';
import { OverlayEventDetail } from '@ionic/core';

@Component({
    selector: 'app-location-map',
    templateUrl: './location-map.component.html',
    styleUrls: ['./location-map.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LocationMapComponent extends BaseComponent implements OnInit {

    // google maps zoom level
    zoom = 8;
    marker: Marker;
    agmMarkerSrc = 'assets/imgs/location-pin.png';
    formattedAddress = 'Kuwait city, Kuwait';

    @Input() addressPageClass = false;
    @Input() locationDetails = { latitude: 0, longitude: 0 };
    @Output() newLocationDetails = new EventEmitter();

    constructor(
        private translate: TranslateService,
        private modalController: ModalController,
    ) {
        super();
    }

    ngOnInit() {

        this.marker = {
            lat: this.locationDetails.latitude,
            lng: this.locationDetails.longitude,
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
        const latLong = {
            latitude: this.marker.lat,
            longitude: this.marker.lng
        };
        this.newLocationDetails.emit(latLong);
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

            const latLong = {
                latitude: this.marker.lat,
                longitude: this.marker.lng
            };
            this.newLocationDetails.emit(latLong);
        }
    }

    async openLocationModal() {
        const modal = await this.modalController.create({
            component: SearchLocationPage
        });
        await modal.present();

        modal.onDidDismiss().then((searchDetail: OverlayEventDetail) => {
          if (!searchDetail) return;
          this.marker.lat = searchDetail.data.latitude;
          this.marker.lng = searchDetail.data.longitude;
          this.formattedAddress = searchDetail.data.formattedAddress;
          this.updateLocationAddress();
        });
    }

}

// Interface for type safety.
interface Marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}
