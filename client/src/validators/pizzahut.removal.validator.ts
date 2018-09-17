import { IValidator, Product, ValidatorAction, BundleItem } from '@capillarytech/pwa-framework';
import { ToppingCounter } from './pizzahut.count.helper';

export class RemovalValidator implements IValidator {
    basedOnDefault: boolean;
    itemRemovalLimit: number;
    isDefault: boolean;

    constructor(basedOnDefault: boolean, itemAdditionLimit: number, isDefault: boolean){
        this.basedOnDefault = basedOnDefault;
        this.itemRemovalLimit = itemAdditionLimit;
        this.isDefault = isDefault;
    }

    allowedAction(): ValidatorAction{
        return ValidatorAction.REMOVE;
    }
    
    validate(clientProduct: Product, item: BundleItem): boolean{
        if(!this.isDefault) {
            return true;
        }
        let validToRemoveItem = false;
        let allowNextDecrease = false;
        
        const counter = new ToppingCounter();
        counter.setSelectedItemsCount(clientProduct);

        let limit = this.itemRemovalLimit;
        let selectedCount = counter.selectedItemCount;
        if(this.basedOnDefault){
            limit = counter.defaultItemCount - this.itemRemovalLimit;
            selectedCount = counter.defaultSelectedItemCount;
        }
        if(selectedCount > limit){
            validToRemoveItem = true;
            clientProduct.allowAddition(true);
        }

        allowNextDecrease = validToRemoveItem;
        if(!(selectedCount - item.count > limit)){
            allowNextDecrease = false;
        }
        clientProduct.allowRemoval(allowNextDecrease);
        return validToRemoveItem;
    }
}