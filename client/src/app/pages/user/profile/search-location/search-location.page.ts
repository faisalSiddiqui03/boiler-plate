import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.page.html',
  styleUrls: ['./search-location.page.scss'],
})
export class SearchLocationPage implements OnInit {

  constructor(private modalController:ModalController) { }

  ngOnInit() {
  }

  closeSearchModal(){
    this.modalController.dismiss();
  }

}
