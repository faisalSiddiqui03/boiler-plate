import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'category/:categoryName/:categoryId', loadChildren: './pages/product/category/category.module#CategoryPageModule' },
  { path: 'search', loadChildren: './pages/product/search/search.module#SearchPageModule' },
  { path: 'address', loadChildren: './pages/user/address/saved-address/saved-address.module#SavedAddressPageModule' },
  { path: 'settings', loadChildren: './pages/user/settings/settings.module#SettingsPageModule' },
  { path: 'profile', loadChildren: './pages/user/profile/profile.module#ProfilePageModule' },
  { path: 'wallet', loadChildren: './pages/user/wallet/wallet.module#WalletPageModule' },
  { path: 'cart', loadChildren: './pages/checkout/cart/cart.module#CartPageModule' },
  { path: 'fast-checkout', loadChildren: './pages/checkout/fast-checkout/fast-checkout.module#FastCheckoutPageModule' },
  { path: 'fulfilment-mode', loadChildren: './pages/checkout/fulfilment-mode/fulfilment-mode.module#FulfilmentModePageModule' },
  { path: 'address-selection', loadChildren: './pages/checkout/address-selection/address-selection.module#AddressSelectionPageModule' },
  { path: 'payment-method', loadChildren: './pages/checkout/payment-method/payment-method.module#PaymentMethodPageModule' },
  { path: 'add-card', loadChildren: './pages/checkout/add-card/add-card.module#AddCardPageModule' },
  { path: 'order-complete', loadChildren: './pages/checkout/order-complete/order-complete.module#OrderCompletePageModule' },
  { path: 'faq', loadChildren: './pages/static/faq/faq.module#FaqPageModule' },
  { path: 'press', loadChildren: './pages/static/press/press.module#PressPageModule' },
  { path: 'privacy-policy', loadChildren: './pages/static/privacy-policy/privacy-policy.module#PrivacyPolicyPageModule' },
  { path: 'terms-and-conditions', loadChildren: './pages/static/tnc/tnc.module#TermsAndConditionsPageModule' },
  { path: 'contact-us', loadChildren: './pages/static/contact-us/contact-us.module#ContactUsPageModule' },
  { path: 'about-us', loadChildren: './pages/static/about-us/about-us.module#AboutUsPageModule' },
  { path: 'careers', loadChildren: './pages/static/careers/careers.module#CareersPageModule' },
  { path: 'order-history', loadChildren: './pages/user/order/order-history/order-history.module#OrderHistoryPageModule' },
  { path: 'order-details', loadChildren: './pages/user/order/order-details/order-details.module#OrderDetailsPageModule' },
  { path: 'product/:productTitle/:productId', loadChildren: './pages/product/product-details/product-details.module#ProductDetailsPageModule' },
  { path: 'new-address', loadChildren: './pages/user/address/new-address/new-address.module#NewAddressPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/user/auth/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './pages/user/auth/signup/signup.module#SignupPageModule' },
  { path: 'password-reset', loadChildren: './pages/user/auth/password-reset/password-reset.module#PasswordResetPageModule' },
  { path: 'product-details', loadChildren: './pages/product/product-details/product-details.module#ProductDetailsPageModule' },
  { path: 'category-listing', loadChildren: './pages/product/category-listing/category-listing.module#CategoryListingPageModule' },
  { path: 'cart', loadChildren: './pages/checkout/cart/cart.module#CartPageModule' },
  { path: 'profile', loadChildren: './pages/user/profile/profile.module#ProfilePageModule' },
  { path: 'user-profile', loadChildren: './pages/user/profile/user-profile/user-profile.module#UserProfilePageModule' },
  { path: 'change-password', loadChildren: './pages/user/profile/change-password/change-password.module#ChangePasswordPageModule' },
  { path: 'order-history', loadChildren: './pages/user/profile/order-history/order-history.module#OrderHistoryPageModule' },
  { path: 'saved-address', loadChildren: './pages/user/profile/saved-address/saved-address.module#SavedAddressPageModule' },
  { path: 'add-address', loadChildren: './pages/user/profile/add-address/add-address.module#AddAddressPageModule' },
  { path: 'favorites', loadChildren: './pages/user/profile/favorites/favorites.module#FavoritesPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
