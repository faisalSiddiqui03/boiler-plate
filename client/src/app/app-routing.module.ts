import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'product/:categoryName/:productName/:productId', loadChildren: './pages/product/product-details/product-details.module#ProductDetailsPageModule'},
  { path: 'login', loadChildren: './pages/user/auth/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './pages/user/auth/signup/signup.module#SignupPageModule' },
  { path: 'password-reset', loadChildren: './pages/user/auth/password-reset/password-reset.module#PasswordResetPageModule' },
  { path: 'product-details', loadChildren: './pages/product/product-details/product-details.module#ProductDetailsPageModule' },
  { path: 'cart', loadChildren: './pages/checkout/cart/cart.module#CartPageModule' },
  { path: 'user-profile', loadChildren: './pages/user/profile/user-profile/user-profile.module#UserProfilePageModule' },
  { path: 'change-password', loadChildren: './pages/user/profile/change-password/change-password.module#ChangePasswordPageModule' },
  { path: 'order-history', loadChildren: './pages/user/profile/order-history/order-history.module#OrderHistoryPageModule' },
  { path: 'saved-address', loadChildren: './pages/user/profile/saved-address/saved-address.module#SavedAddressPageModule' },
  { path: 'add-address', loadChildren: './pages/user/profile/add-address/add-address.module#AddAddressPageModule' },
  { path: 'favorites', loadChildren: './pages/user/profile/favorites/favorites.module#FavoritesPageModule' },
  { path: 'about-us', loadChildren: './pages/static/about-us/about-us.module#AboutUsPageModule' },
  { path: 'contact-us', loadChildren: './pages/static/contact-us/contact-us.module#ContactUsPageModule' },
  { path: 'feedback', loadChildren: './pages/static/feedback/feedback.module#FeedbackPageModule' },
  { path: 'faq', loadChildren: './pages/static/faq/faq.module#FaqPageModule' },
  { path: 'nutrition', loadChildren: './pages/static/nutrition/nutrition.module#NutritionPageModule' },
  { path: 'terms', loadChildren: './pages/static/terms/terms.module#TermsPageModule' },
  { path: 'privacy-policy', loadChildren: './pages/static/privacy-policy/privacy-policy.module#PrivacyPolicyPageModule' },
  { path: 'store-selection', loadChildren: './pages/checkout/store-selection/store-selection.module#StoreSelectionPageModule' },
  { path: 'my-account', loadChildren: './pages/user/profile/my-account/my-account.module#MyAccountPageModule' },
  { path: 'delivery-slot-selection', loadChildren: './pages/checkout/delivery-slot-selection/delivery-slot-selection.module#DeliverySlotSelectionModule' },
  { path: 'pizza/:productId', loadChildren: './pages/product/pizza/pizza.module#PizzaPageModule' },
  { path: 'products', loadChildren: './pages/product/category-listing/category-listing.module#CategoryListingPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
