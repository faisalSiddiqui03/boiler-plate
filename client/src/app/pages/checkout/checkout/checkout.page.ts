import { Component, OnInit, AfterViewInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../helpers/utils';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService, AlertService, HardwareService } from '@capillarytech/pwa-ui-helpers';
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
  DeliveryModes,
  CapRouterService,
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../../base/base-component';
import { element } from 'protractor';
import { CartPriceDetails } from '@capillarytech/pwa-framework/services/cart/models/cart-price-details';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()


export class CheckoutPage extends BaseComponent implements OnInit, AfterViewInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  checkoutForm: FormGroup;
  currencyCode: string;
  asSoonPossible = false;
  slotSelected = false;
  slotContent = '';
  activeTimeSlot: number;
  timeSlotObj;
  asapText: '';
  showdropdown = true;
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
  isAddNewAddressClicked = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private utilService: UtilService,
    private translate: TranslateService,
    private config: ConfigService,
    private actRoute: ActivatedRoute,
    private capRouter: CapRouterService,
    private hardwareService: HardwareService
  ) {

    super();
    this.deliveryModes = DeliveryModes;

    this.translate.use(this.getCurrentLanguageCode());

    this.currencyCode = this.config.getConfig()['currencyCode'];

    this.checkoutForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[2,5,6,9][0-9]*$')])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      building: ['', Validators.compose([Validators.required])],
      street: ['', Validators.compose([Validators.required])],
      comment: [''],
      paymentMethod: ['COD'],
      addressType: ['Home'],
      saveAddress: [false]

    });
  }

  titleValue = '';
  showSlotsModal = false;

  ngOnInit() {
    this.translate.use(this.getCurrentLanguageCode());

    this.translate.get('checkout_page.secure_checkout').subscribe(value => {
      this.titleValue = value;
    });

    this.setLoggedInUserDetails();
    if (this.getFulfilmentMode().mode === this.deliveryModes.PICKUP) {
      this.checkoutForm.controls['building'].setValue('T');
      this.checkoutForm.controls['street'].setValue('T');
    }
  }

  ionViewWillEnter() {
    this.getDeliverySlotPromise().then((slot) => {

      if (slot.id === -2) {
        // TODO : generate store promise
        const store = this.getCurrentStore();
        if (store === null) {
            this.presentSlotModal();
        } else if (!store.isOnline(this.getDeliveryMode())) {
            this.presentSlotModal();
        } else {
            this.setDeliverySlot(DeliverySlot.getAsap());
        }
      }
    });

    // TODO : get cart and redirect to showcase
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setLoggedInUserDetails();
    }, 3000);
  }

  ionViewWillLeave() {
    this.isAddNewAddressClicked = false;
  }

  goToPage(pageName, navParams = {}) {
    // this.capRouter.routeByUrlWithLanguage(pageName);
    this.router.navigateByUrl(this.getNavigationUrlWithLangSupport(pageName), navParams);
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
        if (!this.utilService.isEmpty(this.getDeliverySlot())) {
          this.asSoonPossible = this.getDeliverySlot().id === -1;
          this.slotContent = this.asSoonPossible ? this.asapText : this.utilService.getTimeHHMM(this.getDeliverySlot().time);
          this.timeSlotObj = this.getDeliverySlot();
          this.activeTimeSlot = this.findIndexOfSlot(this.getDeliverySlot().id, data);
        } else {
          this.asSoonPossible = data[0].id === -1;
          this.slotContent = this.asSoonPossible ? this.asapText : this.utilService.getTimeHHMM(data[0].time);
          this.timeSlotObj = data[0];
        }
        break;
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
    this.showdropdown = false;
    this.closePickTime();
  }

  closePickTime() {
    this.showSlotsModal = false;
  }

  selectTime(timeslot, index) {
    this.asSoonPossible = !(timeslot.id !== -1);
    this.slotSelected = true;
    this.slotContent = this.utilService.getTimeHHMM(timeslot.time);
    this.activeTimeSlot = index;
    this.timeSlotObj = timeslot;
    this.showdropdown = false;
  }

  setDefaultPaymentOption(data) {
    // try to move default payment option to config
    const defaultPayment = 'COD';
    data.forEach(element => {
      if (element.paymentOption == defaultPayment) this.objPayment = element;
    });
  }

  async placeOrder() {
    this.loaderService.startLoading(null, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader' : 'pickup-loader');
    const obj: CheckoutDetails = new CheckoutDetails();

    obj.paymentDetails = this.objPayment;

    const objShipAddress: Address = new Address();
    if (this.getFulfilmentMode().mode === this.deliveryModes.PICKUP) {
      objShipAddress.address1 = this.getCurrentStore().address;
    } else {
      objShipAddress.address1 = this.checkoutForm.value.building;
      objShipAddress.address2 = this.checkoutForm.value.street;
    }
    // objShipAddress.addressType = 'Home';
    const contactDetail = new ContactDetail();
    contactDetail.firstName = this.checkoutForm.value.name;
    contactDetail.emailID = this.checkoutForm.value.email;
    contactDetail.mobileNumber = this.checkoutForm.value.mobile;
    objShipAddress.contactDetail = contactDetail;


    objShipAddress.city = this.getCurrentStore().city;
    objShipAddress.country = this.getCurrentStore().country;
    objShipAddress.state = this.getCurrentStore().state;
    objShipAddress.pinCode = parseInt(this.getCurrentStore().area.pincode);
    obj.shippingAddress = objShipAddress;

    const attributes: OrderAttributes[] = new Array<OrderAttributes>();
    const attr: OrderAttributes = new OrderAttributes();
    attr.name = 'IsImmediateOrder';
    attr.value = 'true';

    attributes.push(attr);
    obj.orderAttributes = attributes;

    let source = this.config.getConfig()['source'];
    if ( source ) {
        source.SelectedValue = 'pwa-' + this.getSourceData();
        source.OrderEntityFieldValues[0].Value = 'pwa-' + this.getSourceData();
    }

    obj.deliverySlot = this.getDeliverySlot();
    const action = new Action(CheckoutWidgetActions.ACTION_PLACE_ORDER, obj);
    this.checkoutWidgetAction.emit(action);
  }

  /**helper function for channelId based on platform */
  private getSourceData() {
    let type = 'PWA,';
    const os = this.hardwareService.getOSDetails()['name'];
    if (os === 'Android' || os === 'iOS') {
        type = 'APP,';
    }
    type += os;
    return type;
  }

  handleOrderSuccess(data) {
    this.loaderService.stopLoading();
    if (data.orderId) {
      this.alertService.presentToast(this.translate.instant('checkout_page.order_successful'), 500, top);
      if (this.checkoutForm.value.saveAddress) {
        this.widgetModels['singleUserAddress'].detail = this.checkoutForm.value.building;
        this.widgetModels['singleUserAddress'].landmark = this.checkoutForm.value.street;
        this.widgetModels['singleUserAddress'].city = this.getCurrentStore().city;
        this.widgetModels['singleUserAddress'].country = this.getCurrentStore().country;
        this.widgetModels['singleUserAddress'].state = this.getCurrentStore().state;
        this.widgetModels['singleUserAddress'].addressType = this.checkoutForm.value.addressType;
        this.widgetModels['singleUserAddress'].contactDetail = new ContactDetail();
        this.widgetModels['singleUserAddress'].locationDetail = this.getCurrentStore().locationDetail;

        const action = new Action(UserAddressWidgetActions.SAVE, this.widgetModels['singleUserAddress']);
        this.singleUserAddressWidgetActions.emit(action);
      }
      this.goToPage('success/' + data.orderId + '/' + this.checkoutForm.value.email);
    } else {
      this.alertService.presentToast(this.translate.instant('checkout_page.order_failure'), 500, top);
    }

  }

  handleSaveAddressSuccess(data) {
    console.log('Save address response ', data);
  }

  setLoggedInUserDetails() {
    const userData = this.getUserModel();
    if (userData && userData.type !== 'GUEST') {
      this.checkoutForm.controls['name'].setValue(userData.firstName + ' ' + userData.lastName);
      this.checkoutForm.controls['mobile'].setValue(userData.mobileNo);
      this.checkoutForm.controls['email'].setValue(userData.username);
      // this.getSavedAddresses();
    }
  }

  getSavedAddresses(addresses) {
    console.log('faisal ', addresses);
    // this.savedAddresses = addresses;
    this.savedAddresses = addresses.filter(elem =>
      elem.city.code === this.getCurrentStore().city.code
    );
    this.useSavedAddress = this.savedAddresses.length > 0;
    if (this.useSavedAddress) {
      const index = 0;
      this.selectAddress(index);
    }
  }

  selectAddress(index) {
    this.selectedSavedAddress = this.savedAddresses[index];

    this.checkoutForm.controls['building'].setValue(this.savedAddresses[index].address1);
    this.checkoutForm.controls['street'].setValue(this.savedAddresses[index].address2);
    this.checkoutForm.controls['addressType'].setValue(this.savedAddresses[index].addressType);
  }

  slectPaymentOption(option) {
    this.objPayment = option;
  }

}
