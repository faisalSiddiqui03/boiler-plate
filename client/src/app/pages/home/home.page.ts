import { Component, OnInit, EventEmitter } from '@angular/core';
import { LifeCycle, Action, pwaLifeCycle, OnWidgetActionsLifecyle, OnWidgetLifecyle, ConfigService } from '@capillarytech/pwa-framework';
import { LocationWidgetActions } from '@capillarytech/pwa-framework';
import { BasePage } from '../../base/base-page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

@pwaLifeCycle()
export class HomePage implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
  
  loaded = false;
  bundleWidgetAction = new EventEmitter();
  bundleWidgetExecutor = new EventEmitter();
  bannerUrl: string;

  slideOpts = {
    effect: 'flip'
  };
  constructor(private config: ConfigService, private router:Router) { 
    this.bannerUrl = this.config.getConfig()['banner_base_url'];
  }
  orderMode = 'DELIVERY';
  locationsWidgetAction = new EventEmitter();
  dataLoaded: any = {};
  isDropDownShown = false;
  selectedCity = '';

  ngOnInit() {
  }

  widgetLoadingSuccess(name, data) {
    console.log('home page -> location widget', name, data);
  }

  handleWidgetLifecycle(x: LifeCycle) {
  }

  widgetActionFailed(name: string, data: any) {

    console.log('failed name = ', name, ' data = ', data);
  }

  widgetActionSuccess(name: string, data: any) {

    console.log('name = ', name, ' data = ', data);
  }

  widgetLoadingFailed(name: string, data: any) {

    console.log('name = ', name, ' data = ', data);
  }

  widgetLoadingStarted(name: string, data: any) {

    console.log('name = ', name, ' data = ', data);
  }

  /**
   * @name: could be area, city town based on
   * requirement of brand
   */
  toggleDropDown(name: string, force: boolean = false, forceValue?: boolean) {
    this.isDropDownShown = true;
  }

  filterEntity(e, type) {

  }

  selectCity(cityName) {
    this.selectedCity = cityName;
    this.isDropDownShown = false;
  }

  locateMe(){
    console.log('locate me');
  }

  getFullBannerUrl(src) {
    return src ? this.bannerUrl + src + '?height=170&width=340&builder=freeimage' : null;
  }
  navigateToDeals() {
    this.router.navigateByUrl('/product/deals/CU00215646');
  }
}
