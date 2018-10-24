import { IValidator, Product, ValidatorAction, BundleItem } from '@capillarytech/pwa-framework';
import { ToppingCounter } from './pizzahut.count.helper';
import { AttributeName, AttributeValue } from '@capillarytech/pwa-components';

export class DecrementValidator implements IValidator {
    itemRemovalLimit: number;

    constructor(itemRemovalLimit: number){
        this.itemRemovalLimit = itemRemovalLimit;
    }

    allowedAction(): Array<ValidatorAction>{
        return [ValidatorAction.DECREMENT, ValidatorAction.REMOVE];
    }
    
    validate(clientProduct: Product, item: BundleItem, action: ValidatorAction): boolean{
        if(BundleItem.getAttributeValueByName(item.baseItem, AttributeName.IS_CHEESE) === AttributeValue.TRUE) {
            return true;
        }
        let validToRemoveItem = false;
        
        const counter = new ToppingCounter();
        counter.setSelectedItemsCount(clientProduct);

        let selectedCount = counter.selectedItemCount;
        const limit = counter.defaultItemCount - this.itemRemovalLimit;

        if(action === ValidatorAction.REMOVE){
            selectedCount = selectedCount - item.count;
        }
        else if(action === ValidatorAction.DECREMENT){
            selectedCount = selectedCount - 1;
        }
        if(selectedCount >= limit){
            validToRemoveItem = true;
            clientProduct.allowAddition(true);
        }
        return validToRemoveItem;
    }
}