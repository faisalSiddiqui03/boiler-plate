import { Component, OnInit, AfterViewInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService, AlertService, HardwareService } from '@capillarytech/pwa-ui-helpers';
import {
  pwaLifeCycle,
  LifeCycle,
  Action,
  pageView,
  ConfigService,
  DeliverySlot,
  ContactDetail,
  OrderAttributes,
  CapRouterService, EventTrackWidgetActions,
} from '@capillarytech/pwa-framework';
import { CheckoutComponent, InputOrderDetails, UserDetails } from '../../../../comp-test/checkout/checkout.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()
export class CheckoutPage extends CheckoutComponent implements OnInit, AfterViewInit {

  checkoutForm: FormGroup;
  currencyCode: string;
  useSavedAddress = true;
  selectedSavedAddress;
  showdropdownAddressType = false;
  savedAddresses = [];

  paymentOptionsWidgetAction = new EventEmitter();
  eventTrackWidgetActions = new EventEmitter();

  checkoutWidgetAction = new EventEmitter();
  widgetModels = {};
  isAddNewAddressClicked = false;
  addressTypes = [];
  titleValue = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private config: ConfigService,
    private capRouter: CapRouterService
  ) {

    super();

    this.translate.use(this.getCurrentLanguageCode());

    this.currencyCode = this.config.getConfig()['currencyCode'];

    this.checkoutForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      mobile: ['', Validators.compose([Validators.required,
      Validators.pattern('^[2,5,6,9][0-9]*$'),
      Validators.minLength(8),
      Validators.maxLength(8)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      building: ['', Validators.compose([Validators.required])],
      street: ['', Validators.compose([Validators.required])],
      comment: [''],
      paymentMethod: ['COD'],
      addressType: ['home'],
      saveAddress: [false]

    });
  }

  ngOnInit() {
    this.translate.use(this.getCurrentLanguageCode());

    this.translate.get('checkout_page.secure_checkout').subscribe(value => {
      this.titleValue = value;
    });

    this.setLoggedInUserDetails();
    if (this.getDeliveryMode() === this.deliveryModes.PICKUP) {
      this.checkoutForm.controls['building'].setValue('T');
      this.checkoutForm.controls['street'].setValue('T');
    }

    this.addressTypes = this.utilService.getAddressTypes();
  }

  ionViewWillEnter() {
    this.checkSlots();
    this.checkCart();
  }

  handleDefaultStoreSlotError() {
    this.presentSlotModal();
  }

  handleDefaultStoreSlotSuccess() {
    this.setDeliverySlot(DeliverySlot.getAsap());
  }

  handleEmptyCart() {
    this.goToDeals();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setLoggedInUserDetails();
    }, 3000);
  }

  ionViewWillLeave() {
    this.isAddNewAddressClicked = false;
  }

  handleUserAddressLoadingSuccess(data) {
    this.getSavedAddresses(data);
  }

  handleUserAddressLoadingFailure() {
    this.getSavedAddresses([]);
  }

  async placeOrder() {
    await this.loaderService.startLoading(null, this.getDeliveryMode() === 'H' ? 'delivery-loader' : 'pickup-loader');

    const inputOrderDetails = new InputOrderDetails;
    inputOrderDetails.address1 = this.checkoutForm.value.building;
    inputOrderDetails.address2 = this.checkoutForm.value.street;
    inputOrderDetails.firstName = this.checkoutForm.value.name;
    inputOrderDetails.emailID = this.checkoutForm.value.email;
    inputOrderDetails.mobileNumber = this.checkoutForm.value.mobile;
    inputOrderDetails.giftMessage = this.checkoutForm.value.comment || '';
    inputOrderDetails.addressType = this.checkoutForm.value.addressType || '';

    // adding IsImmediateOrder attribute
    const attributes: OrderAttributes[] = new Array<OrderAttributes>();
    const attr: OrderAttributes = new OrderAttributes();
    attr.name = 'IsImmediateOrder';
    attr.value = 'true';
    attributes.push(attr);

    this.placeOrderComp(inputOrderDetails, attributes);
  }

  async handleOrderActionSuccess(data) {
    this.loaderService.stopLoading();
    if (data.orderId) {
      this.eventTrackWidgetActions.emit(
        new Action(
          EventTrackWidgetActions.ACTION_PURCHASE,
          [
            data.orderId,
            this.checkoutForm.value.email
          ]
        )
      );
      await this.alertService.presentToast(this.translate.instant('checkout_page.order_successful'), 500, 'top', 'top');
      if (this.checkoutForm.value.saveAddress) {
        const userDetails = new UserDetails();
        userDetails.detail = this.checkoutForm.value.building;
        userDetails.landmark = this.checkoutForm.value.street;
        userDetails.addressType = this.checkoutForm.value.addressType;
        userDetails.contactDetail = new ContactDetail();
        this.saveAddress(userDetails);
      }
      this.goToPage('success/' + data.orderId + '/' + btoa(this.checkoutForm.value.email));
    } else {
      await this.alertService.presentToast(this.translate.instant('checkout_page.order_failure'), 500, 'top', 'top');
    }
  }

  handleGetShippingAddressActionSuccess(data) {
    this.fillDataFromCache(data);
  }

  async handleSaveUserActionSuccess() {
    await this.alertService.presentToast(this.translate.instant('checkout_page.address_saved_successfully'), 500, 'bottom');
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
    // this.savedAddresses = addresses; TODO : check with faisale
    this.savedAddresses = addresses.filter(elem =>
      elem.city.code === this.getCurrentStore().selectedCityId
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

  setDefaultPaymentOption(data) {
    // try to move default payment option to config
    const defaultPayment = 'COD';
    data.forEach(element => {
      if (element.paymentOption == defaultPayment) this.objPayment = element;
    });
  }

  goToPage(pageName, navParams = {}) {
    // this.capRouter.routeByUrlWithLanguage(pageName);
    this.router.navigateByUrl(this.getNavigationUrlWithLangSupport(pageName), navParams);
  }

  presentSlotModal() {
    this.showSlotsModal = true;
  }

  // todo: use this data to prefill the form.
  fillDataFromCache(data) {
    if (!data) return;
    this.checkoutForm.controls['name'].setValue(data.contactDetail.firstName);
    this.checkoutForm.controls['mobile'].setValue(data.contactDetail.mobileNumber);
    this.checkoutForm.controls['email'].setValue(data.contactDetail.emailID);
    this.checkoutForm.controls['building'].setValue(data.address1);
    this.checkoutForm.controls['street'].setValue(data.address2);
  }

  goToDeals() {
    this.capRouter.routeByUrlWithLanguage('/products?category=deals&id=CU00215646');
  }

}
