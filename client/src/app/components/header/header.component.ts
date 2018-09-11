import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../base/base-component';
import { ModalController } from '@ionic/angular';
import { DeliverySlotSelectionPage } from '../../pages/checkout/delivery-slot-selection/delivery-slot-selection.page';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseComponent implements OnInit {

  constructor(
    private router: Router,
    public modalController: ModalController
  ) {
    super();
   }

  /** Inputs to show only required tags in header */
  @Input() showHalalTag = false;
  @Input() showLanguage = false;
  @Input() showTime = false;
  @Input() showCart = false;
  @Input() headerClass = '';

  ngOnInit() {
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

  async presentSlotModal() {
    const modal = await this.modalController.create({
      component: DeliverySlotSelectionPage,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }

}
