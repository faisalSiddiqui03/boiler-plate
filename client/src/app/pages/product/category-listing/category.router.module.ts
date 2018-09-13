import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DummyPage } from '../dummy/dummy.page';
import { SunnyPage } from '../sunny/sunny.page';
import {CategoryListingPage } from './category-listing.page';

const routes: Routes = [
  {
    path: 'listing',
    component: CategoryListingPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: '0',
        outlet: '0',
        component: CategoryListingPage
      },
      {
        path: '1',
        outlet: '1',
        component: CategoryListingPage
      },
      {
        path: '2',
        outlet: '2',
        component: CategoryListingPage
      },
      {
        path: '3',
        outlet: '3',
        component: CategoryListingPage
      },
      {
        path: '4',
        outlet: '4',
        component: CategoryListingPage
      },
      {
        path: '5',
        outlet: '5',
        component: CategoryListingPage
      },
      {
        path: '6',
        outlet: '6',
        component: CategoryListingPage
      },
      {
        path: '7',
        outlet: '7',
        component: CategoryListingPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/products/listing/(0:0)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRouterModule {
}
