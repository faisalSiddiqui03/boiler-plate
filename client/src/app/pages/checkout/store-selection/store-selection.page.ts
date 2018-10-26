import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import { pageView } from '@capillarytech/pwa-framework';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-store-selection',
  templateUrl: './store-selection.page.html',
  styleUrls: ['./store-selection.page.scss'],
})
@pageView()
export class StoreSelectionPage extends BaseComponent implements OnInit {

  cityId;
  latitude;
  longitude;

  constructor(
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.cityId = params.cityId;
      this.latitude = params.latitude;
      this.longitude = params.longitude;
    });
  }
}
