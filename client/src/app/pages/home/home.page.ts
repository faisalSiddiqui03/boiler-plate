import { Component, OnInit, EventEmitter } from '@angular/core';
import {
  LifeCycle,
  Action,
  pwaLifeCycle,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle
} from '@capillarytech/pwa-framework';
import { LocationWidgetActions } from '@capillarytech/pwa-framework';
import { BasePage } from '../../base/base-page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

@pwaLifeCycle()
export class HomePage extends BasePage implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  slideOpts = {
    effect: 'flip'
  };

  constructor(private router: Router) {
    super();
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
    // let getAllCities = new Action(LocationWidgetActions.ACTION_FETCH_ALL_CITIES);

    // this.locationsWidgetAction.emit(getAllCities);
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

  locateMe() {

  }

  filterEntity(e, type) {

  }

  selectCity(cityName) {
    this.selectedCity = cityName;
    this.isDropDownShown = false;
  }

  navigateToDeals() {
    this.router.navigateByUrl('/product/deals/CU00215646');
  }
}
