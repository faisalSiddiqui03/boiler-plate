import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header.component';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationWidgetModule } from '@cap-widget/navigation-widget';
import { LogoutWidgetModule } from '@cap-widget/authentication/logout';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogoutWidgetModule,
    NavigationWidgetModule,
    TranslateModule
  ],
  declarations: [
    HeaderComponent,
  ],
  exports: [
    HeaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class HeaderModule {
}
