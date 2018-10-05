import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { Action, LifeCycle, pwaLifeCycle, WidgetNames } from "@capillarytech/pwa-framework";
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { BaseComponent } from '../../base/base-component';
import { UtilService } from '../../helpers/utils';

@Component({
  selector: 'app-category-navigation',
  templateUrl: './category-navigation.component.html',
  styleUrls: ['./category-navigation.component.scss']
})
@pwaLifeCycle()
export class CategoryNavigationComponent extends BaseComponent implements OnInit {
  @Input('refcode')
  refcode: string;

  @Input('activeCategoryId')
  activeCategoryId = '0'; // 0 is default for All categories

  loaded = false;
  navigationWidgetAction = new EventEmitter();
  navigationWidgetExecutor = new EventEmitter();

  showDepartmentsPopup = false;
  constructor(private router: Router,
    private translate: TranslateService,
    private utilService: UtilService) {
    super();
  }

  ngOnInit() {
    this.translate.use(this.utilService.getLanguageCode());
  }

  toggleDepartmentsPopup() {
    this.showDepartmentsPopup = !this.showDepartmentsPopup;
  }

  widgetLoadingSuccess(widgetName, model) {
    switch (widgetName) {
      case WidgetNames.NAVIGATIONS.toString():
        //hard Coding url for time being
        this.loaded = true;
        model.items.forEach((navigationItem) => {
          navigationItem.isActive = this.activeCategoryId && navigationItem.categoryId === this.activeCategoryId;
        });
        break;
    }
  }

  widgetLoadingFailed(widgetName, model) {
    switch (widgetName) {
      case WidgetNames.NAVIGATIONS.toString():
        this.loaded = true;
        break;
    }
  }

  handleWidgetLifecycle(x: LifeCycle) {
    if (x.type == LifeCycle.WIDGET_LOADING_SUCCESS) {
      this.loaded = true;
    } else if (x.type == LifeCycle.PRIMARY_ACTION_SUCCESS) {
      alert("Action Successful: " + x.data)
    } else {
      console.log(x);
    }
  }

  navigateToCategory(navigationItem) {
    if (navigationItem === '0') {
      this.activeCategoryId = '0';
      this.router.navigateByUrl(this.utilService.getLanguageCode() + '/home');
    } else {
      this.activeCategoryId = navigationItem.categoryId;
      this.router.navigateByUrl(this.utilService.getLanguageCode() + '/category/' + encodeURI(navigationItem.name) + '/' + navigationItem.categoryId);
    }
  }

  getActiveCategoryName(categories) {
    // console.log('FINDING ACTIVE CATEGORY NAME: ', this.activeCategoryId);
    let categoryName = '';
    if (this.activeCategoryId === '0') {
      // console.log('FOUND 1 ACTIVE CATEGORY NAME: ALL DEPS');
      return 'All Departments';
    }
    categories.forEach((category) => {
      if (category.categoryId === this.activeCategoryId) {
        categoryName = category.name;
      }
    });
    console.log('FOUND 2 ACTIVE CATEGORY NAME: ', categoryName);
    return categoryName;
  }

  // onSelectChange(selectedValue: any) {
  //   this.router.navigateByUrl('/category/' + encodeURI(selectedValue.detail.text) + '/' + selectedValue.detail.value);
  // }
}
