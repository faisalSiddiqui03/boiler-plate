import { Component, OnInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../helpers/utils';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import {
    pwaLifeCycle,
    LifeCycle,
    Action,
    pageView,
    ConfigService,
    OnWidgetActionsLifecyle,
    OnWidgetLifecyle,
    DeliverySlotsWidget,
    CheckoutWidgetActions,
    UserAddressWidgetActions,
    CheckoutDetails,
    Payment,
    DeliverySlot,
    City,
    Area,
    Country,
    State,
    LocationDetails,
    Address,
    ContactDetail,
    OrderAttributes,
    Checkout,
    Transaction,
    DeliveryModes
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../../base/base-component';
import { element } from 'protractor';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'], 
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()


export class CheckoutPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  checkoutForm: FormGroup;
  currencyCode:string;
  asSoonPossible = false;
  slotSelected = false;
  slotContent = '';
  activeTimeSlot: number;
  timeSlotObj;
  asapText:'';
  showdropdown=true;
  objPayment: Payment = new Payment();
  useSavedAddress = true;
  selectedSavedAddress;
  showdropdownAddressType = false;
  savedAddresses = [];

  paymentOptionsWidgetAction = new EventEmitter();

  checkoutWidgetAction = new EventEmitter();
  singleUserAddressWidgetActions = new EventEmitter();
  userAddressWidgetActions = new EventEmitter();
  widgetModels = {};
  deliveryModes: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private config: ConfigService,
  ) {

    super();
    this.deliveryModes = DeliveryModes;

    this.translate.use(Utils.getLanguageCode());

    this.currencyCode = this.config.getConfig()['currencyCode'];

    this.checkoutForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[2,5,6,9][0-9]*$')])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      building: ['', Validators.compose([Validators.required])],
      street: ['', Validators.compose([Validators.required])],
      comment: [''],
      paymentMethod:['COD'],
      addressType: ['Home'],
      saveAddress: [false]

    });
  }

  titleValue = '';
  showSlotsModal = false;

  ngOnInit() {
    this.translate.get('checkout_page.secure_checkout').subscribe(value => {
      this.titleValue = value;
    });

    this.setLoggedInUserDetails();
  }

  goToPage(pageName, navParams = {}) {
    this.router.navigateByUrl(pageName, navParams);
  }

  presentSlotModal() {
    this.showSlotsModal = true;
  }

  widgetActionFailed(name: string, data: any): any {
    console.log(name, 'Action Failed');
  }

  widgetActionSuccess(name: string, data: any) {
    switch (name) {
      case CheckoutWidgetActions.ACTION_PLACE_ORDER:
        console.log('Model data ', data);
        this.handleOrderSuccess(data);
        break;
      case CheckoutWidgetActions.ACTION_RETRY_ORDER_PAYMENT:
        console.log('Model of this data ', data);
        break;
      case CheckoutWidgetActions.ACTION_GET_SHIPPING_ADDRESS:
        console.log('Shipping address data ', data);
        break;
      case CheckoutWidgetActions.ACTION_GET_BILLING_ADDRESS:
        console.log('Billing address data ', data);
        break;
      case CheckoutWidgetActions.ACTION_GET_PAYMENT_OPTIONS:
        console.log('Payment option data ', data);
        this.setDefaultPaymentOption(data);
        break;
      case CheckoutWidgetActions.ACTION_GET_ORDER_ATTRIBUTES:
        console.log('attributes data ', data);
        break;
    }
  }

  widgetLoadingFailed(name: string, data: any): any {
    console.log(name, 'Loading Failed');
  }

  widgetLoadingStarted(name: string, data: any): any {
    console.log(name, 'Loading Started');
  }

  widgetLoadingSuccess(name: string, data: any): any {
    console.log(name, 'Loading Success ', data);
    switch (name) {
        case 'DELIVERYSLOTS':
          if (!Utils.isEmpty(this.getDeliverySlot())) {
            this.asSoonPossible = this.getDeliverySlot().id === -1;
            this.slotContent = this.asSoonPossible ? this.asapText : Utils.getTimeHHMM(this.getDeliverySlot().time);
            this.timeSlotObj = this.getDeliverySlot();
            this.activeTimeSlot = this.findIndexOfSlot(this.getDeliverySlot().id, data);
          } else {
            this.asSoonPossible = data[0].id === -1;
            this.slotContent = this.asSoonPossible ? this.asapText : Utils.getTimeHHMM(data[0].time);
            this.timeSlotObj = data[0];
          }
        case 'PAYMENT_OPTIONS':
            this.setDefaultPaymentOption(data);
            break;
        case 'singleUserAddress':
          this.widgetModels['singleUserAddress'] = data;
          break;
        case 'USER_ADDRESS': 
          this.getSavedAddresses(data);
          break;
      }
  }

  findIndexOfSlot(selectedSlotId, data) {
    return data.findIndex(slot => slot.id === selectedSlotId);
  }

  selectTimeSlot() {
    console.log('slot is: ', this.timeSlotObj);
    this.setDeliverySlot(this.timeSlotObj);
    this.showdropdown = false
    this.closePickTime();
  }

  closePickTime() {
      this.showSlotsModal = false;
  }

  selectTime(timeslot, index) {
    this.asSoonPossible = !(timeslot.id !== -1);
    this.slotSelected = true;
    this.slotContent = Utils.getTimeHHMM(timeslot.time);
    this.activeTimeSlot = index;
    this.timeSlotObj = timeslot;
    this.showdropdown = false
  }

  setDefaultPaymentOption(data) {
    //try to move default payment option to config
    const defaultPayment = 'COD';
    data.forEach(element => {
        if(element.paymentOption == defaultPayment) this.objPayment = element;
    });
  }

  async placeOrder() {
    this.loaderService.startLoading();
    const obj: CheckoutDetails = new CheckoutDetails();

    obj.paymentDetails = this.objPayment;

    const objShipAddress: Address = new Address();
    objShipAddress.address1 = this.checkoutForm.value.building;
    objShipAddress.address2 = this.checkoutForm.value.street;
    // objShipAddress.addressType = 'Home';
    const contactDetail = new ContactDetail();
    contactDetail.firstName = this.checkoutForm.value.name;
    contactDetail.emailID = this.checkoutForm.value.email;
    contactDetail.mobileNumber = this.checkoutForm.value.mobile;
    objShipAddress.contactDetail = contactDetail;


    objShipAddress.city = this.getCurrentStore().city;
    objShipAddress.country = this.getCurrentStore().country;
    objShipAddress.state = this.getCurrentStore().state;
    obj.shippingAddress = objShipAddress;

    const attributes: OrderAttributes[] = new Array<OrderAttributes>();
    const attr: OrderAttributes = new OrderAttributes();
    attr.name = 'IsImmediateOrder';
    attr.value = 'true';

    attributes.push(attr);
    obj.orderAttributes = attributes;

    obj.deliverySlot = this.getDeliverySlot();
    let action = new Action(CheckoutWidgetActions.ACTION_PLACE_ORDER, obj);
    this.checkoutWidgetAction.emit(action);
  }

  handleOrderSuccess(data) {
      this.loaderService.stopLoading();
    if(data.orderId) {
        this.alertService.presentToast(this.translate.instant('checkout_page.order_successful'), 500, top);
        if(this.checkoutForm.value.saveAddress) {
            this.widgetModels['singleUserAddress'].address1 = this.checkoutForm.value.building;
            this.widgetModels['singleUserAddress'].address2 = this.checkoutForm.value.street;
            this.widgetModels['singleUserAddress'].city = this.getCurrentStore().city;
            this.widgetModels['singleUserAddress'].country = this.getCurrentStore().country;
            this.widgetModels['singleUserAddress'].state = this.getCurrentStore().state;
            this.widgetModels['singleUserAddress'].addressType = this.checkoutForm.value.addressType
            
            let action = new Action(UserAddressWidgetActions.SAVE);
            this.singleUserAddressWidgetActions.emit(action);
        }
        this.goToPage('success/' + data.orderId + '/' + this.checkoutForm.value.email);
    } else {
        this.alertService.presentToast(this.translate.instant('checkout_page.order_failure'), 500, top);
    }

  }

  handleSaveAddressSuccess(data) {
      console.log('Save address response ', data)
  }

  setLoggedInUserDetails() {
      const userData = this.getUserModel();
    if(userData && userData.type !== 'GUEST') {
        this.checkoutForm.controls['name'].setValue(userData.firstName + ' ' + userData.lastName);
        this.checkoutForm.controls['mobile'].setValue(userData.mobileNo);
        this.checkoutForm.controls['email'].setValue(userData.username);
        // this.getSavedAddresses();
    }
  }

  getSavedAddresses(addresses) {
    console.log('UK ', addresses)
    this.savedAddresses = addresses.map(elem => {
        if(elem.city.code == this.getCurrentStore().city.code) return elem;
    });
    this.useSavedAddress = this.savedAddresses.length > 0;
  }

  selectAddress(index) {
    this.checkoutForm.controls['building'].setValue(this.savedAddresses[index].address1);
    this.checkoutForm.controls['street'].setValue(this.savedAddresses[index].address2);
  }

  slectPaymentOption(option) {
      this.objPayment = option;
  }

}