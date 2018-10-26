import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { pwaLifeCycle } from '@capillarytech/pwa-framework';
import { LoaderService } from '@capillarytech/pwa-ui-helpers';
import { ActivatedRoute } from '@angular/router';
import { CapRouterService } from '@capillarytech/pwa-framework';
import { StoreListingComponent } from '@capillarytech/pwa-components/store-list/store-list.component';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss'],
})
@pwaLifeCycle()
export class StoreListComponent extends StoreListingComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private capRouter: CapRouterService,
    private modalController: ModalController,
  ) {
    super();
  }

  ngOnInit() {
    if (!this.isModal) {
      this.route.queryParams.subscribe(params => {
        this.cityId = params.cityId;
        this.latitude = params.latitude;
        this.longitude = params.longitude;
        if (!this.cityId && !this.latitude && !this.longitude) {
          this.goToHome();
        }
      });
    }
  }

  ionViewDidEnter(){
    this.loaderService.stopLoading();
  }

  navigateToDeals() {
    if (this.isModal) {
      this.modalController.dismiss(true);
      return;
    }
    this.capRouter.routeByUrl('/products?category=deals&id=CU00215646');
  }

  handleEmptyStoresResponse() {
    this.goToHome();
  }

  handleSelectStoreSuccess() {    
    this.navigateToDeals();
  }

  goToHome() {
    if(this.isModal) {
      this.modalController.dismiss(false);
      return;
    }
    this.capRouter.routeByUrl('/home');
  }

}
