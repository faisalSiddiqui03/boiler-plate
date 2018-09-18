import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-seacrh-location',
  templateUrl: './seacrh-location.page.html',
  styleUrls: ['./seacrh-location.page.scss'],
})
export class SeacrhLocationPage implements OnInit {

  constructor(private modalController:ModalController) { }

  ngOnInit() {
  }

  closeSearchModal(){
    this.modalController.dismiss();
  }

}
