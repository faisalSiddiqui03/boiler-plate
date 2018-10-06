import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import languages from './languages';


let defaultLang = '';
languages.forEach((lang) => {
  if (lang.isDefault) {
    defaultLang = lang.code;
  }
})

const routes: Routes = [
  { path: '', redirectTo: defaultLang + '/home', pathMatch: 'full' },

  { path: 'home', redirectTo: defaultLang + '/home' },
  { path: ':lang/home', loadChildren: './pages/home/home.module#HomePageModule' },

  { path: 'product/:categoryName/:productName/:productId', redirectTo: defaultLang + '/product/:categoryName/:productName/:productId' },
  { path: ':lang/product/:categoryName/:productName/:productId', loadChildren: './pages/product/product-details/product-details.module#ProductDetailsPageModule' },

  { path: 'login', redirectTo: defaultLang + '/login' },
  { path: ':lang/login', loadChildren: './pages/user/auth/login/login.module#LoginPageModule' },

  { path: 'signup', redirectTo: defaultLang + '/signup' },
  { path: ':lang/signup', loadChildren: './pages/user/auth/signup/signup.module#SignupPageModule' },

  { path: 'password-reset', redirectTo: defaultLang + '/password-reset' },
  { path: ':lang/password-reset', loadChildren: './pages/user/auth/password-reset/password-reset.module#PasswordResetPageModule' },

  { path: 'product-details', redirectTo: defaultLang + '/product-details' },
  { path: ':lang/product-details', loadChildren: './pages/product/product-details/product-details.module#ProductDetailsPageModule' },

  { path: 'cart', redirectTo: defaultLang + '/cart' },
  { path: ':lang/cart', loadChildren: './pages/checkout/cart/cart.module#CartPageModule' },

  { path: 'user-profile', redirectTo: defaultLang + '/user-profile' },
  { path: ':lang/user-profile', loadChildren: './pages/user/profile/user-profile/user-profile.module#UserProfilePageModule', canActivate: [AuthGuard] },

  { path: 'change-password', redirectTo: defaultLang + '/change-password' },
  { path: ':lang/change-password', loadChildren: './pages/user/profile/change-password/change-password.module#ChangePasswordPageModule', canActivate: [AuthGuard] },

  { path: 'order-history', redirectTo: defaultLang + '/order-history' },
  { path: ':lang/order-history', loadChildren: './pages/user/profile/order-history/order-history.module#OrderHistoryPageModule', canActivate: [AuthGuard] },

  { path: 'saved-address', redirectTo: defaultLang + '/saved-address' },
  { path: ':lang/saved-address', loadChildren: './pages/user/profile/saved-address/saved-address.module#SavedAddressPageModule', canActivate: [AuthGuard] },

  { path: 'add-address', redirectTo: defaultLang + '/add-address' },
  { path: ':lang/add-address', loadChildren: './pages/user/profile/add-address/add-address.module#AddAddressPageModule', canActivate: [AuthGuard] },

  { path: 'favorites', redirectTo: defaultLang + '/favorites' },
  { path: ':lang/favorites', loadChildren: './pages/user/profile/favorites/favorites.module#FavoritesPageModule', canActivate: [AuthGuard] },

  { path: 'about-us', redirectTo: defaultLang + '/about-us' },
  { path: ':lang/about-us', loadChildren: './pages/static/about-us/about-us.module#AboutUsPageModule' },

  { path: 'contact-us', redirectTo: defaultLang + '/contact-us' },
  { path: ':lang/contact-us', loadChildren: './pages/static/contact-us/contact-us.module#ContactUsPageModule' },

  { path: 'feedback', redirectTo: defaultLang + '/feedback' },
  { path: ':lang/feedback', loadChildren: './pages/static/feedback/feedback.module#FeedbackPageModule' },

  { path: 'faq', redirectTo: defaultLang + '/faq' },
  { path: ':lang/faq', loadChildren: './pages/static/faq/faq.module#FaqPageModule' },

  { path: 'nutrition', redirectTo: defaultLang + '/nutrition' },
  { path: ':lang/nutrition', loadChildren: './pages/static/nutrition/nutrition.module#NutritionPageModule' },

  { path: 'terms', redirectTo: defaultLang + '/terms' },
  { path: ':lang/terms', loadChildren: './pages/static/terms/terms.module#TermsPageModule' },

  { path: 'privacy-policy', redirectTo: defaultLang + '/privacy-policy' },
  { path: ':lang/privacy-policy', loadChildren: './pages/static/privacy-policy/privacy-policy.module#PrivacyPolicyPageModule' },

  { path: 'store-selection', redirectTo: defaultLang + '/store-selection' },
  { path: ':lang/store-selection', loadChildren: './pages/checkout/store-selection/store-selection.module#StoreSelectionPageModule' },

  { path: 'my-account', redirectTo: defaultLang + '/my-account' },
  { path: ':lang/my-account', loadChildren: './pages/user/profile/my-account/my-account.module#MyAccountPageModule', canActivate: [AuthGuard] },

  { path: 'delivery-slot-selection', redirectTo: defaultLang + '/delivery-slot-selection' },
  { path: ':lang/delivery-slot-selection', loadChildren: './pages/checkout/delivery-slot-selection/delivery-slot-selection.module#DeliverySlotSelectionModule' },

  { path: 'products', redirectTo: defaultLang + '/products' },
  { path: ':lang/products', loadChildren: './pages/product/category-listing/category-listing.module#CategoryListingPageModule' },

  { path: 'pizza/:productName/:productId', redirectTo: defaultLang + '/pizza/:productName/:productId' },
  { path: ':lang/pizza/:productName/:productId', loadChildren: './pages/product/pizza/pizza.module#PizzaPageModule' },

  { path: 'location', redirectTo: defaultLang + '/location' },
  { path: ':lang/location', loadChildren: './pages/checkout/location/location.module#LocationPageModule' },

  { path: 'order-details/:orderId', redirectTo: defaultLang + '/order-details/:orderId' },
  { path: ':lang/order-details/:orderId', loadChildren: './pages/user/profile/order-details/order-details.module#OrderDetailsPageModule' },

  { path: 'search-location', redirectTo: defaultLang + '/search-location' },
  { path: ':lang/search-location', loadChildren: './pages/user/profile/search-location/search-location.module#SearchLocationPageModule' },

  { path: 'checkout', redirectTo: defaultLang + '/checkout' },
  { path: ':lang/checkout', loadChildren: './pages/checkout/checkout/checkout.module#CheckoutPageModule' },

  { path: 'deal/:productName/:productId', redirectTo: defaultLang + '/deal/:productName/:productId' },
  { path: ':lang/deal/:productName/:productId', loadChildren: './pages/product/deal/deal.module#DealPageModule' },

  { path: 'success/:orderId/:email', redirectTo: defaultLang + '/success/:orderId/:email' },
  { path: ':lang/success/:orderId/:email', loadChildren: './pages/checkout/success/success.module#SuccessPageModule' },

  //{ path: 'checker', loadChildren: './checker/checker.module#CheckerPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
