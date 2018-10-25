import { Component, OnInit, AfterViewInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService, AlertService, HardwareService } from '@capillarytech/pwa-ui-helpers';
import {
  pwaLifeCycle,
  pageView,
  ConfigService,
  DeliverySlot
} from '@capillarytech/pwa-framework';
import { ContactDetail, Address } from '@cap-widget/user-address';
import { SinglePageCheckoutComponent, UserIdentifier } from '@capillarytech/pwa-components';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()
export class CheckoutPage extends SinglePageCheckoutComponent implements OnInit, AfterViewInit {

  checkoutForm: FormGroup;
  useSavedAddress = true;
  selectedSavedAddress;
  savedAddresses = [];
  widgetModels = {};
  isAddNewAddressClicked = false;
  titleValue = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private config: ConfigService,
    public hardwareService: HardwareService,
    private capRouter: CapRouterService,
  ) {
    super({
      handleGaEvent: true,
      identifier: UserIdentifier.EMAIL,
      handleEmptyPaymentOption: true
    }, hardwareService);

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
      saveAddress: [false],
    });
  }

  ngOnInit() {
    this.translate.get('checkout_page.secure_checkout').subscribe(value => {
      this.titleValue = value;
    });

    this.setLoggedInUserDetails();
    if (this.getDeliveryMode() === this.deliveryModes.PICKUP) {
      this.checkoutForm.controls['building'].setValue('T');
      this.checkoutForm.controls['street'].setValue('T');
    }
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
    this.setLoggedInUserDetails();
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
    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode());

    const objShipAddress = new Address();
    objShipAddress.address1 = this.checkoutForm.value.building;
    objShipAddress.address2 = this.checkoutForm.value.street;
    objShipAddress.addressType = this.checkoutForm.value.addressType || '';

    const contactDetail = new ContactDetail();
    contactDetail.firstName = this.checkoutForm.value.name;
    contactDetail.emailID = this.checkoutForm.value.email;
    contactDetail.mobileNumber = this.checkoutForm.value.mobile;
    objShipAddress.contactDetail = contactDetail;

    super.placeOrder(objShipAddress);
  }

  async handleOrderActionSuccess(data) {
    this.loaderService.stopLoading();
    if (data.orderId) {
      await this.alertService.presentToast(this.translate.instant('checkout_page.order_successful'), 500, 'top', 'top');
      if (this.checkoutForm.value.saveAddress) {
        const userAddress = new Address();
        userAddress.detail = this.checkoutForm.value.building;
        userAddress.landmark = this.checkoutForm.value.street;
        userAddress.addressType = this.checkoutForm.value.addressType;
        userAddress.contactDetail = new ContactDetail();
        this.saveAddress(userAddress);
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

  async setLoggedInUserDetails() {
    const userData = await this.getUserPromise();
    if (userData && userData.type !== 'GUEST') {
      this.checkoutForm.controls['name'].setValue(userData.firstName + ' ' + userData.lastName);
      this.checkoutForm.controls['mobile'].setValue(userData.mobileNo);
      this.checkoutForm.controls['email'].setValue(userData.username);
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
    this.capRouter.routeByUrl('/products?category=deals&id=CU00215646');
  }

}
