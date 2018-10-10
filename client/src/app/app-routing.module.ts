import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
// import languages from './languages';

var defaultLang = 'en';

const routes: Routes = [
  //{ path: 'home', redirectTo: defaultLang + '/home' },
  //{ path: 'product/:categoryName/:productName/:productId', redirectTo: defaultLang + '/product/:categoryName/:productName/:productId' },
  //{ path: 'login', redirectTo: defaultLang + '/login' },
  //{ path: 'signup', redirectTo: defaultLang + '/signup' },
  //{ path: 'password-reset', redirectTo: defaultLang + '/password-reset' },
  //{ path: 'product-details', redirectTo: defaultLang + '/product-details' },
  //{ path: 'cart', redirectTo: defaultLang + '/cart' },
  //{ path: 'user-profile', redirectTo: defaultLang + '/user-profile' },
  //{ path: 'change-password', redirectTo: defaultLang + '/change-password' },
  //{ path: 'order-history', redirectTo: defaultLang + '/order-history' },
  //{ path: 'saved-address', redirectTo: defaultLang + '/saved-address' },
  //{ path: 'add-address', redirectTo: defaultLang + '/add-address' },
  //{ path: 'favorites', redirectTo: defaultLang + '/favorites' },
  //{ path: 'about-us', redirectTo: defaultLang + '/about-us' },
  //{ path: 'contact-us', redirectTo: defaultLang + '/contact-us' },
  //{ path: 'feedback', redirectTo: defaultLang + '/feedback' },
  //{ path: 'nutrition', redirectTo: defaultLang + '/nutrition' },
  //{ path: 'faq', redirectTo: defaultLang + '/faq' },
  //{ path: 'terms', redirectTo: defaultLang + '/terms' },
  //{ path: 'store-selection', redirectTo: defaultLang + '/store-selection' },
  //{ path: 'privacy-policy', redirectTo: defaultLang + '/privacy-policy' },
  //{ path: 'my-account', redirectTo: defaultLang + '/my-account' },
  //{ path: 'delivery-slot-selection', redirectTo: defaultLang + '/delivery-slot-selection' },
  //{ path: 'products', redirectTo: defaultLang + '/products' },
  //{ path: 'pizza/:productName/:productId', redirectTo: defaultLang + '/pizza/:productName/:productId' },
  //{ path: 'location', redirectTo: defaultLang + '/location' },
  //{ path: 'order-details/:orderId', redirectTo: defaultLang + '/order-details/:orderId' },
  //{ path: 'search-location', redirectTo: defaultLang + '/search-location' },
  //{ path: 'checkout', redirectTo: defaultLang + '/checkout' },
  //{ path: 'deal/:productName/:productId', redirectTo: defaultLang + '/deal/:productName/:productId' },
  //{ path: 'success/:orderId/:email', redirectTo: defaultLang + '/success/:orderId/:email' },
  //{ path: 'checker', loadChildren: './checker/checker.module#CheckerPageModule' },

  { path: '', redirectTo: defaultLang + '/home', pathMatch: 'full' },
  { path: ':lang/home', loadChildren: './pages/home/home.module#HomePageModule', pathMatch:'prefix' },
  { path: ':lang/product/:categoryName/:productName/:productId', loadChildren: './pages/product/product-details/product-details.module#ProductDetailsPageModule' },
  { path: ':lang/login', loadChildren: './pages/user/auth/login/login.module#LoginPageModule' },
  { path: ':lang/signup', loadChildren: './pages/user/auth/signup/signup.module#SignupPageModule' },
  { path: ':lang/password-reset', loadChildren: './pages/user/auth/password-reset/password-reset.module#PasswordResetPageModule' },
  { path: ':lang/product-details', loadChildren: './pages/product/product-details/product-details.module#ProductDetailsPageModule' },
  { path: ':lang/cart', loadChildren: './pages/checkout/cart/cart.module#CartPageModule' },
  { path: ':lang/user-profile', loadChildren: './pages/user/profile/user-profile/user-profile.module#UserProfilePageModule', canActivate: [AuthGuard] },
  { path: ':lang/change-password', loadChildren: './pages/user/profile/change-password/change-password.module#ChangePasswordPageModule', canActivate: [AuthGuard] },
  { path: ':lang/order-history', loadChildren: './pages/user/profile/order-history/order-history.module#OrderHistoryPageModule', canActivate: [AuthGuard] },
  { path: ':lang/saved-address', loadChildren: './pages/user/profile/saved-address/saved-address.module#SavedAddressPageModule', canActivate: [AuthGuard] },
  { path: ':lang/add-address/:addressId', loadChildren: './pages/user/profile/add-address/add-address.module#AddAddressPageModule', canActivate: [AuthGuard] },
  { path: ':lang/favorites', loadChildren: './pages/user/profile/favorites/favorites.module#FavoritesPageModule', canActivate: [AuthGuard] },
  { path: ':lang/about-us', loadChildren: './pages/static/about-us/about-us.module#AboutUsPageModule' },
  { path: ':lang/contact-us', loadChildren: './pages/static/contact-us/contact-us.module#ContactUsPageModule' },
  { path: ':lang/feedback', loadChildren: './pages/static/feedback/feedback.module#FeedbackPageModule' },
  { path: ':lang/faq', loadChildren: './pages/static/faq/faq.module#FaqPageModule' },
  { path: ':lang/nutrition', loadChildren: './pages/static/nutrition/nutrition.module#NutritionPageModule' },
  { path: ':lang/terms', loadChildren: './pages/static/terms/terms.module#TermsPageModule' },
  { path: ':lang/privacy-policy', loadChildren: './pages/static/privacy-policy/privacy-policy.module#PrivacyPolicyPageModule' },
  { path: ':lang/store-selection', loadChildren: './pages/checkout/store-selection/store-selection.module#StoreSelectionPageModule' },
  { path: ':lang/my-account', loadChildren: './pages/user/profile/my-account/my-account.module#MyAccountPageModule', canActivate: [AuthGuard] },
  { path: ':lang/delivery-slot-selection', loadChildren: './pages/checkout/delivery-slot-selection/delivery-slot-selection.module#DeliverySlotSelectionModule' },
  { path: ':lang/products', loadChildren: './pages/product/category-listing/category-listing.module#CategoryListingPageModule' },
  { path: ':lang/pizza/:productName/:productId', loadChildren: './pages/product/pizza/pizza.module#PizzaPageModule' },
  { path: ':lang/location', loadChildren: './pages/checkout/location/location.module#LocationPageModule' },
  { path: ':lang/order-details/:orderId', loadChildren: './pages/user/profile/order-details/order-details.module#OrderDetailsPageModule' },
  { path: ':lang/search-location', loadChildren: './pages/user/profile/search-location/search-location.module#SearchLocationPageModule' },
  { path: ':lang/checkout', loadChildren: './pages/checkout/checkout/checkout.module#CheckoutPageModule' },
  { path: ':lang/deal/:productName/:productId', loadChildren: './pages/product/deal/deal.module#DealPageModule' },
  { path: ':lang/success/:orderId/:email', loadChildren: './pages/checkout/success/success.module#SuccessPageModule' },
  { path: ':lang/success/:orderId', loadChildren: './pages/checkout/success/success.module#SuccessPageModule' },
  { path: '**', redirectTo: 'en/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
