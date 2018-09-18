import { IValidator, Product, ValidatorAction, BundleItem } from '@capillarytech/pwa-framework';
import { ToppingCounter } from './pizzahut.count.helper';


export class IncrementValidator implements IValidator {
    itemAdditionLimit: number;

    constructor(itemAdditionLimit: number){
        this.itemAdditionLimit = itemAdditionLimit;
    }

    allowedAction(): Array<ValidatorAction>{
        return [ValidatorAction.ADD];
    }

    validate(clientProduct: Product, item: BundleItem, action: ValidatorAction): boolean{
        let validToAddItem = false;

        const counter = new ToppingCounter();
        counter.setSelectedItemsCount(clientProduct);
        
        let allowNextAddition = false;
        const limit = counter.defaultItemCount + this.itemAdditionLimit;
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