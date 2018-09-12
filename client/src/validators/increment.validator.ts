import { IValidator, Product, ValidatorAction } from '@capillarytech/pwa-framework';


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

    validate(clientProduct: Product): boolean{
        let validToAddItem = false;
        clientProduct.setSelectedItemsCount();
        let limit = this.itemAdditionLimit;
        let allowNextAddition = false;
        if(this.basedOnDefault){
            limit = clientProduct.defaultItemCount + this.itemAdditionLimit;
        }
        if(clientProduct.selectedItemCount < limit){
            validToAddItem = true;
        }

        allowNextAddition = validToAddItem;
        if(!(clientProduct.selectedItemCount + 1 < limit)){
            allowNextAddition = false;
        }
        clientProduct.allowAddition(allowNextAddition);
        clientProduct.resetSelectedItemsCount();
        return validToAddItem;
    }
}