import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'ar/home', pathMatch: 'full' },

  { path: 'home', redirectTo: 'ar/home' },
  { path: ':lang/home', loadChildren: './pages/home/home.module#HomePageModule' },

  { path: 'product/:categoryName/:productName/:productId', redirectTo: 'ar/product/:categoryName/:productName/:productId' },
  { path: ':lang/product/:categoryName/:productName/:productId', loadChildren: './pages/product/product-details/product-details.module#ProductDetailsPageModule' },

  { path: 'login', redirectTo: 'ar/login' },
  { path: ':lang/login', loadChildren: './pages/user/auth/login/login.module#LoginPageModule' },

  { path: 'signup', redirectTo: 'ar/signup' },
  { path: ':lang/signup', loadChildren: './pages/user/auth/signup/signup.module#SignupPageModule' },

  { path: 'password-reset', redirectTo: 'ar/password-reset' },
  { path: ':lang/password-reset', loadChildren: './pages/user/auth/password-reset/password-reset.module#PasswordResetPageModule' },

  { path: 'product-details', redirectTo: 'ar/product-details' },
  { path: ':lang/product-details', loadChildren: './pages/product/product-details/product-details.module#ProductDetailsPageModule' },

  { path: 'cart', redirectTo: 'ar/cart' },
  { path: ':lang/cart', loadChildren: './pages/checkout/cart/cart.module#CartPageModule' },

  { path: 'user-profile', redirectTo: 'ar/user-profile' },
  { path: ':lang/user-profile', loadChildren: './pages/user/profile/user-profile/user-profile.module#UserProfilePageModule', canActivate: [AuthGuard] },

  { path: 'change-password', redirectTo: 'ar/change-password' },
  { path: ':lang/change-password', loadChildren: './pages/user/profile/change-password/change-password.module#ChangePasswordPageModule', canActivate: [AuthGuard] },

  { path: 'order-history', redirectTo: 'ar/order-history' },
  { path: ':lang/order-history', loadChildren: './pages/user/profile/order-history/order-history.module#OrderHistoryPageModule', canActivate: [AuthGuard] },

  { path: 'saved-address', redirectTo: 'ar/saved-address' },
  { path: ':lang/saved-address', loadChildren: './pages/user/profile/saved-address/saved-address.module#SavedAddressPageModule', canActivate: [AuthGuard] },

  { path: 'add-address', redirectTo: 'ar/add-address' },
  { path: ':lang/add-address', loadChildren: './pages/user/profile/add-address/add-address.module#AddAddressPageModule', canActivate: [AuthGuard] },

  { path: 'favorites', redirectTo: 'ar/favorites' },
  { path: ':lang/favorites', loadChildren: './pages/user/profile/favorites/favorites.module#FavoritesPageModule', canActivate: [AuthGuard] },

  { path: 'about-us', redirectTo: 'ar/about-us' },
  { path: ':lang/about-us', loadChildren: './pages/static/about-us/about-us.module#AboutUsPageModule' },

  { path: 'contact-us', redirectTo: 'ar/contact-us' },
  { path: ':lang/contact-us', loadChildren: './pages/static/contact-us/contact-us.module#ContactUsPageModule' },

  { path: 'feedback', redirectTo: 'ar/feedback' },
  { path: ':lang/feedback', loadChildren: './pages/static/feedback/feedback.module#FeedbackPageModule' },

  { path: 'faq', redirectTo: 'ar/faq' },
  { path: ':lang/faq', loadChildren: './pages/static/faq/faq.module#FaqPageModule' },

  { path: 'nutrition', redirectTo: 'ar/nutrition' },
  { path: ':lang/nutrition', loadChildren: './pages/static/nutrition/nutrition.module#NutritionPageModule' },

  { path: 'terms', redirectTo: 'ar/terms' },
  { path: ':lang/terms', loadChildren: './pages/static/terms/terms.module#TermsPageModule' },

  { path: 'privacy-policy', redirectTo: 'ar/privacy-policy' },
  { path: ':lang/privacy-policy', loadChildren: './pages/static/privacy-policy/privacy-policy.module#PrivacyPolicyPageModule' },

  { path: 'store-selection', redirectTo: 'ar/store-selection' },
  { path: ':lang/store-selection', loadChildren: './pages/checkout/store-selection/store-selection.module#StoreSelectionPageModule' },

  { path: 'my-account', redirectTo: 'ar/my-account' },
  { path: ':lang/my-account', loadChildren: './pages/user/profile/my-account/my-account.module#MyAccountPageModule', canActivate: [AuthGuard] },

  { path: 'delivery-slot-selection', redirectTo: 'ar/delivery-slot-selection' },
  { path: ':lang/delivery-slot-selection', loadChildren: './pages/checkout/delivery-slot-selection/delivery-slot-selection.module#DeliverySlotSelectionModule' },

  { path: 'products', redirectTo: 'ar/products' },
  { path: ':lang/products', loadChildren: './pages/product/category-listing/category-listing.module#CategoryListingPageModule' },

  { path: 'pizza/:productName/:productId', redirectTo: 'ar/pizza/:productName/:productId' },
  { path: ':lang/pizza/:productName/:productId', loadChildren: './pages/product/pizza/pizza.module#PizzaPageModule' },

  { path: 'location', redirectTo: 'ar/location' },
  { path: ':lang/location', loadChildren: './pages/checkout/location/location.module#LocationPageModule' },

  { path: 'order-details', redirectTo: 'ar/order-details' },
  { path: ':lang/order-details', loadChildren: './pages/user/profile/order-details/order-details.module#OrderDetailsPageModule' },

  { path: 'search-location', redirectTo: 'ar/search-location' },
  { path: ':lang/search-location', loadChildren: './pages/user/profile/search-location/search-location.module#SearchLocationPageModule' },

  { path: 'checkout', redirectTo: 'ar/checkout' },
  { path: ':lang/checkout', loadChildren: './pages/checkout/checkout/checkout.module#CheckoutPageModule' },

  { path: 'deal/:productName/:productId', redirectTo: 'ar/deal/:productName/:productId' },
  { path: ':lang/deal/:productName/:productId', loadChildren: './pages/product/deal/deal.module#DealPageModule' },

  { path: 'success/:orderId/:email', redirectTo: 'ar/success/:orderId/:email' },
  { path: ':lang/success/:orderId/:email', loadChildren: './pages/checkout/success/success.module#SuccessPageModule' },

  //{ path: 'checker', loadChildren: './checker/checker.module#CheckerPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
