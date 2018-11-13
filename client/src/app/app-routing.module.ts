import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
// import languages from './languages';

var defaultLang = 'en';

const routes: Routes = [
  // { path: 'home', redirectTo: defaultLang + '/home' },
  // { path: 'product/:categoryName/:productName/:productId', redirectTo: defaultLang + '/product/:categoryName/:productName/:productId' },
  // { path: 'login', redirectTo: defaultLang + '/login' },
  // { path: 'signup', redirectTo: defaultLang + '/signup' },
  // { path: 'password-reset', redirectTo: defaultLang + '/password-reset' },
  // { path: 'product-details', redirectTo: defaultLang + '/product-details' },
  // { path: 'cart', redirectTo: defaultLang + '/cart' },
  // { path: 'user-profile', redirectTo: defaultLang + '/user-profile' },
  // { path: 'change-password', redirectTo: defaultLang + '/change-password' },
  // { path: 'order-history', redirectTo: defaultLang + '/order-history' },
  // { path: 'saved-address', redirectTo: defaultLang + '/saved-address' },
  // { path: 'add-address', redirectTo: defaultLang + '/add-address' },
  // { path: 'favorites', redirectTo: defaultLang + '/favorites' },
  // { path: 'about-us', redirectTo: defaultLang + '/about-us' },
  // { path: 'contact-us', redirectTo: defaultLang + '/contact-us' },
  // { path: 'feedback', redirectTo: defaultLang + '/feedback' },
  // { path: 'nutrition', redirectTo: defaultLang + '/nutrition' },
  // { path: 'faq', redirectTo: defaultLang + '/faq' },
  // { path: 'terms', redirectTo: defaultLang + '/terms' },
  // { path: 'store-selection', redirectTo: defaultLang + '/store-selection' },
  // { path: 'privacy-policy', redirectTo: defaultLang + '/privacy-policy' },
  // { path: 'my-account', redirectTo: defaultLang + '/my-account' },
  // { path: 'delivery-slot-selection', redirectTo: defaultLang + '/delivery-slot-selection' },
  // { path: 'products', redirectTo: defaultLang + '/products' },
  // { path: 'pizza/:productName/:productId', redirectTo: defaultLang + '/pizza/:productName/:productId' },
  // { path: 'location', redirectTo: defaultLang + '/location' },
  // { path: 'order-details/:orderId', redirectTo: defaultLang + '/order-details/:orderId' },
  // { path: 'search-location', redirectTo: defaultLang + '/search-location' },
  // { path: 'checkout', redirectTo: defaultLang + '/checkout' },
  // { path: 'deal/:productName/:productId', redirectTo: defaultLang + '/deal/:productName/:productId' },
  // { path: 'success/:orderId/:email', redirectTo: defaultLang + '/success/:orderId/:email' },
  // { path: 'checker', loadChildren: './checker/checker.module#CheckerPageModule' },

  { path: '', redirectTo: defaultLang + '/login', pathMatch: 'full' },
  { path: ':lang/home', loadChildren: './pages/home/home.module#HomePageModule', pathMatch:'prefix' },
  { path: ':lang/login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
