import { IValidator, Product, ValidatorAction, BundleItem } from '@cap-widget/product-modules';
import { AttributeName, AttributeValue } from '@capillarytech/pwa-components';

export class ToppingCounter {
  defaultItemCount: number;
  defaultSelectedItemCount: number;
  selectedItemCount: number;

  constructor() {
    this.defaultItemCount = 0;
    this.defaultSelectedItemCount = 0;
    this.selectedItemCount = 0;
  }

  setSelectedItemsCount(clientProduct: Product) {
    const items = [];
    clientProduct.baseProduct.bundleGroups.map((group) => { group.items.map((item) => { items.push(item); }); });

    items.map((item) => {
      if (item.isDefault
        && BundleItem.getAttributeValueByName(item, AttributeName.TYPE) !== AttributeValue.SAUCE
        && BundleItem.getAttributeValueByName(item, AttributeName.IS_CHEESE) !== AttributeValue.TRUE) {

        this.defaultItemCount = this.defaultItemCount + 1;
        clientProduct.bundleItems.forEach((clientItem: BundleItem, key: number) => {
          if (item.id === clientItem.id && clientItem.isSelected)
            this.defaultSelectedItemCount = this.defaultSelectedItemCount + clientItem.count;
        });

      }
    });

    items.map((item) => {
      clientProduct.bundleItems.forEach((clientItem: BundleItem, key: number) => {
        if (item.id === clientItem.id
          && clientItem.isSelected
          && BundleItem.getAttributeValueByName(item, AttributeName.TYPE) !== AttributeValue.SAUCE
          && BundleItem.getAttributeValueByName(item, AttributeName.IS_CHEESE) !== AttributeValue.TRUE)
          this.selectedItemCount = this.selectedItemCount + clientItem.count;
      });
    });
  }

  resetSelectedItemsCount() {
    this.defaultItemCount = 0;
    this.defaultSelectedItemCount = 0;
    this.selectedItemCount = 0;
  }
}
