import { BaseComponent } from "../../app/base/base-component";
import {
  CheckoutDetails,
  Payment,
  Address,
  DeliveryModes,
  ContactDetail,
  OrderAttributes,
  Action,
  CheckoutWidgetActions,
  OnWidgetLifecyle,
  OnWidgetActionsLifecyle,
  DeliverySlot,
  WidgetNames,
  Country,
  State,
  UserAddressWidgetActions
} from "@capillarytech/pwa-framework";
import { OnInit, AfterViewInit, EventEmitter } from "@angular/core";
import { DeliverySlotWidgetActions, DeliverySlotsWidget } from "../../../../../pwa-framework/framework/dist/widgets/delivery-slots";
import { UtilService } from "../../app/helpers/utils";
import { FormGroup } from "@angular/forms";
import { appInjector } from "../../../../../pwa-framework/framework/dist/core/app.injector";
import { HardwareService } from "@capillarytech/pwa-ui-helpers";

export class InputOrderDetails {
  address1: string;
  address2: string;
  firstName: string;
  emailID: string;
  mobileNumber: string;
  giftMessage: string;
  addressType: string;
}

export class UserDetails {
  detail: string;
  landmark: string;
  addressType: string;
  contactDetail: ContactDetail;
}

export abstract class CheckoutComponent extends BaseComponent implements OnWidgetLifecyle, OnWidgetActionsLifecyle {

  asSoonPossible = false;
  slotContent = '';
  slotSelected = false;
  showSlotsModal = false;
  showdropdown = true;
  activeTimeSlot: number;
  timeSlotObj;
  asapText: '';
  objPayment: Payment = new Payment();
  singleUserAddressModel: any;
  deliveryModes: any;

  checkoutWidgetAction = new EventEmitter();
  singleUserAddressWidgetActions = new EventEmitter();

  protected utilService: UtilService;
  protected hardwareService: HardwareService;

  constructor() {
    super();

    this.utilService = appInjector.get(UtilService);
    this.hardwareService = appInjector.get(HardwareService);
    this.deliveryModes = DeliveryModes;
  }

  widgetLoadingStarted(name: string, data: any) {
    console.log(name, ' loading Started');
  }

  widgetLoadingSuccess(name: string, data: any) {
    console.log(name, ' loading Success ', data);
    switch (name) {
      case WidgetNames.DELIVERYSLOTS:
        this.handleDelieveySlotLoadingSuccess(data);
        break;
      case WidgetNames.PAYMENT_OPTIONS:
        this.handlePaymentOptionsLoadingSuccess(data);
        break;
      case 'singleUserAddress':
        this.handleSingleUserAddressLoadingSuccess(data);
        break;
      case WidgetNames.USER_ADDRESS:
        this.handleUserAddressLoadingSuccess(data);
        break;
      case WidgetNames.CHECKOUT:
        this.handleCheckoutLoadingSuccess(data);
        break;
    }
  }

  widgetLoadingFailed(name: string, data: any) {
    console.log(name, ' loading failed ', data);
    switch (name) {
      case WidgetNames.DELIVERYSLOTS:
        this.handleDelieveySlotLoadingFailure(data);
        break;
      case WidgetNames.PAYMENT_OPTIONS:
        this.handlePaymentOptionsLoadingFailure(data);
        break;
      case 'singleUserAddress':
        this.handleSingleUserAddressLoadingFailure(data);
        break;
      case WidgetNames.USER_ADDRESS:
        this.handleUserAddressLoadingFailure(data);
        break;
      case WidgetNames.CHECKOUT:
        this.handleCheckoutLoadingFailure(data);
        break;
    }
  }

  async widgetActionSuccess(name: string, data: any) {
    console.log(name, ' action success ', data);
    switch (name) {
      case CheckoutWidgetActions.ACTION_PLACE_ORDER:
        this.handleOrderActionSuccess(data);
        break;
      case CheckoutWidgetActions.ACTION_RETRY_ORDER_PAYMENT:
        this.handleRetryOrderPaymentActionSuccess(data);
        break;
      case CheckoutWidgetActions.ACTION_GET_SHIPPING_ADDRESS:
        this.handleGetShippingAddressActionSuccess(data);
        break;
      case CheckoutWidgetActions.ACTION_GET_BILLING_ADDRESS:
        this.handleGetBillingAddressActionSuccess(data);
        break;
      case CheckoutWidgetActions.ACTION_GET_PAYMENT_OPTIONS:
        this.handleGetPaymentOptionActionSuccess(data);
        break;
      case CheckoutWidgetActions.ACTION_GET_ORDER_ATTRIBUTES:
        this.handleGetOrderAttributesActionSuccess(data);
        break;
      case UserAddressWidgetActions.SAVE:
        this.handleSaveUserActionSuccess(data);
        break;
    }
  }

  widgetActionFailed(name: string, data: any) {
    console.log(name, ' action failed ', data);
    switch (name) {
      case CheckoutWidgetActions.ACTION_PLACE_ORDER:
        this.handleOrderActionFailure(data);
        break;
      case CheckoutWidgetActions.ACTION_RETRY_ORDER_PAYMENT:
        this.handleRetryOrderPaymentActionFailure(data);
        break;
      case CheckoutWidgetActions.ACTION_GET_SHIPPING_ADDRESS:
        this.handleGetShippingAddressActionFailure(data);
        break;
      case CheckoutWidgetActions.ACTION_GET_BILLING_ADDRESS:
        this.handleGetBillingAddressActionFailure(data);
        break;
      case CheckoutWidgetActions.ACTION_GET_PAYMENT_OPTIONS:
        this.handleGetPaymentOptionActionFailure(data);
        break;
      case CheckoutWidgetActions.ACTION_GET_ORDER_ATTRIBUTES:
        this.handleGetOrderAttributesActionFailure(data);
        break;
      case UserAddressWidgetActions.SAVE:
        this.handleSaveUserActionFailure(data);
        break;
    }
  }

  handleDelieveySlotLoadingSuccess(data) {
    if (!this.utilService.isEmpty(this.getDeliverySlot()) && this.getDeliverySlot().id > -2) {
      this.asSoonPossible = this.getDeliverySlot().id === -1;
      this.slotContent = this.asSoonPossible ? this.asapText : this.utilService.getTimeHHMM(this.getDeliverySlot().time);
      this.timeSlotObj = this.getDeliverySlot();
      this.activeTimeSlot = this.findIndexOfSlot(this.getDeliverySlot().id, data);
    } else {
      this.asSoonPossible = data[0].id === -1;
      this.slotContent = this.asSoonPossible ? this.asapText : this.utilService.getTimeHHMM(data[0].time);
      this.timeSlotObj = data[0];
    }
  }

  handleDelieveySlotLoadingFailure(data) {

  }

  handlePaymentOptionsLoadingSuccess(data) {
    this.setDefaultPaymentOption(data);
  }

  handlePaymentOptionsLoadingFailure(data) {

  }

  handleSingleUserAddressLoadingSuccess(data) {
    this.singleUserAddressModel = data;
  }

  handleSingleUserAddressLoadingFailure(data) {

  }

  handleUserAddressLoadingSuccess(data) {
    // Nothing default to do right now
  }

  handleUserAddressLoadingFailure(data) {

  }

  handleCheckoutLoadingSuccess(data) {
    this.getUserPromise().then(userModel => {
      if (userModel.type === 'GUEST') {
        this.checkoutWidgetAction.emit(new Action(CheckoutWidgetActions.ACTION_GET_SHIPPING_ADDRESS));
      }
    });
  }

  handleCheckoutLoadingFailure(data) {

  }

  handleOrderActionSuccess(data) {
    // nothing
  }

  handleOrderActionFailure(data) {
    // nothing
  }

  handleRetryOrderPaymentActionSuccess(data) {
    // nothing
  }

  handleRetryOrderPaymentActionFailure(data) {
    // nothing
  }

  handleGetBillingAddressActionSuccess(data) {
    // nothing
  }

  handleGetBillingAddressActionFailure(data) {
    // nothing
  }

  handleGetShippingAddressActionSuccess(data) {
    // nothing
  }

  handleGetShippingAddressActionFailure(data) {
    // nothing
  }

  handleGetPaymentOptionActionSuccess(data) {
    this.setDefaultPaymentOption(data);
  }

  handleGetPaymentOptionActionFailure(data) {
    // nothing
  }

  handleGetOrderAttributesActionSuccess(data) {
    // nothing
  }

  handleGetOrderAttributesActionFailure(data) {
    // nothing
  }

  handleSaveUserActionSuccess(data) {
    // nothing
  }

  handleSaveUserActionFailure(data) {
    // nothing
  }

  setDefaultPaymentOption(data) {
    // try to move default payment option to config
    const defaultPayment = 'COD';
    data.forEach(element => {
      if (element.paymentOption == defaultPayment) this.objPayment = element;
    });
  }

  findIndexOfSlot(selectedSlotId, data) {
    return data.findIndex(slot => slot.id === selectedSlotId);
  }

  async checkSlots() {
    const slot = await this.getDeliverySlotPromise();
    const store = await this.getCurrentStoreAsync();

    if (slot.id === -2) {
      const store = this.getCurrentStore();
      if (store === null) {
        this.handleDefaultStoreSlotError();
      } else if (!store.isOnline(this.getDeliveryMode())) {
        this.handleDefaultStoreSlotError();
      } else {
        this.handleDefaultStoreSlotSuccess();
      }
    }
  }

  handleDefaultStoreSlotError() {
    // nothing
  }

  handleDefaultStoreSlotSuccess() {
    // nothing
  }

  async checkCart() {
    const cart = await this.getCartAsync();
    if (cart.items.length === 0) this.handleEmptyCart();
  }

  handleEmptyCart() {
    // nothing
  }

  selectTime(timeslot, index) {
    this.asSoonPossible = !(timeslot.id !== -1);
    this.slotSelected = true;
    this.slotContent = this.utilService.getTimeHHMM(timeslot.time);
    this.activeTimeSlot = index;
    this.timeSlotObj = timeslot;
    this.showdropdown = false;
  }

  selectTimeSlot() {
    if (this.timeSlotObj && this.timeSlotObj.id > -2) {
      this.setDeliverySlot(this.timeSlotObj);
    } else {

      this.setDeliverySlot(this.getDeliverySlot());
    }
    this.showdropdown = false;
    this.closePickTime();
  }

  closePickTime() {
    this.showSlotsModal = false;
  }

  async placeOrderComp(inputOrderDetails: InputOrderDetails, attributes: Array<OrderAttributes> = []) {
    const obj: CheckoutDetails = new CheckoutDetails();

    obj.paymentDetails = this.objPayment;

    const objShipAddress: Address = new Address();

    if (this.getDeliveryMode() === this.deliveryModes.PICKUP) {
      objShipAddress.address1 = this.getCurrentStore().address;
    } else {
      objShipAddress.address1 = inputOrderDetails.address1;
      objShipAddress.address2 = inputOrderDetails.address2;
    }

    const contactDetail = new ContactDetail();
    contactDetail.firstName = inputOrderDetails.firstName;
    contactDetail.emailID = inputOrderDetails.emailID;
    contactDetail.mobileNumber = inputOrderDetails.mobileNumber;
    objShipAddress.contactDetail = contactDetail;
    objShipAddress.addressType = inputOrderDetails.addressType;

    objShipAddress.city.code = this.getSelectedCityId();
    objShipAddress.country = this.getCurrentStore().country;
    objShipAddress.state = this.getCurrentStore().state;
    objShipAddress.pinCode = parseInt(this.getCurrentStore().area.pincode, 10);
    obj.shippingAddress = objShipAddress;

    this.checkoutWidgetAction.emit(new Action(CheckoutWidgetActions.ACTION_SAVE_SHIPPING_ADDRESS, objShipAddress));

    // adding channelid attribute
    const channelAttr: OrderAttributes = new OrderAttributes();
    channelAttr.name = 'channelid';
    channelAttr.value = await this.getSourceData();
    attributes.push(channelAttr);

    obj.orderAttributes = attributes;
    obj.deliverySlot = this.getDeliverySlot();
    obj.giftMessage = inputOrderDetails.giftMessage;

    this.checkoutWidgetAction.emit(new Action(CheckoutWidgetActions.ACTION_PLACE_ORDER, obj));
  }

  async getSourceData() {
    let type = 'PWA,';
    const platformDetails = await this.hardwareService.getPlatformDetails();
    if (await this.hardwareService.isMobileApp()) {
      type = 'APP,';
    }
    type += platformDetails;
    return type;
  }

  saveAddress(userDetails: UserDetails) {
    this.singleUserAddressModel.detail = userDetails.detail;
    this.singleUserAddressModel.landmark = userDetails.landmark;
    this.singleUserAddressModel.city = this.getCurrentStore().selectedCityId;
    this.singleUserAddressModel.country = this.getCurrentStore().country;
    this.singleUserAddressModel.state = this.getCurrentStore().state;
    this.singleUserAddressModel.addressType = userDetails.addressType;
    this.singleUserAddressModel.contactDetail = userDetails.contactDetail;
    this.singleUserAddressModel.locationDetail = this.getCurrentStore().locationDetail;
    this.singleUserAddressWidgetActions.emit(new Action(UserAddressWidgetActions.SAVE, this.singleUserAddressModel));
  }

}