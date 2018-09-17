import { IValidator, Product, ValidatorAction, BundleItem } from '@capillarytech/pwa-framework';
import { ToppingCounter } from './pizzahut.count.helper';


export class IncrementValidator implements IValidator {
    basedOnDefault: boolean;
    itemAdditionLimit: number;

    constructor(basedOnDefault: boolean, itemAdditionLimit: number){
        this.basedOnDefault = basedOnDefault;
        this.itemAdditionLimit = itemAdditionLimit;
    }

    allowedAction(): ValidatorAction{
        return ValidatorAction.ADD;
    }

    validate(clientProduct: Product, item: BundleItem): boolean{
        let validToAddItem = false;

        const counter = new ToppingCounter();
        counter.setSelectedItemsCount(clientProduct);
        
        let limit = this.itemAdditionLimit;
        let allowNextAddition = false;
        if(this.basedOnDefault){
            limit = counter.defaultItemCount + this.itemAdditionLimit;
        }
        if(counter.selectedItemCount < limit){
            validToAddItem = true;
        }

        allowNextAddition = validToAddItem;
        if(!(counter.selectedItemCount + 1 < limit)){
            allowNextAddition = false;
        }
        clientProduct.allowAddition(allowNextAddition);
        return validToAddItem;
    }
}