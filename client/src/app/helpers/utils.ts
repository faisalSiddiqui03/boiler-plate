import { LanguageService } from '@capillarytech/pwa-framework';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class UtilService {

  constructor(private langService: LanguageService) {
  }

  private _languageCode: string;

  // async setLanguageCode(langCode: string): Promise<boolean> {
  //   this._languageCode = langCode;
  //   //await this.langService.updateLanguageByCode(langCode);
  //   return true;
  // }

  getLanguageCode(): string {
    return this._languageCode;
  }

  isEmpty(obj): boolean {
    return !obj || Object.getOwnPropertyNames(obj).length === 0;
  }

  getTimeHHMM(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const meridianString = hours < 12 ? 'am' : 'pm';
    const hourString = hours < 12 ? hours : hours - 12;
    const minString = minutes < 10 ? '0' + minutes : minutes;
    return hourString + ':' + minString + ' ' + meridianString;
  }

  getDate(date: Date): string {
    const day = date.getDate();
    const daySting = day < 10 ? '0' + day : day;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
      ;
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return daySting + ' ' + month + ' ' + year;
  }

  getAddressTypes() {
    const translationKeys = ['address_type_home', 'address_type_work', 'address_type_other'];
    const typeValues = ['home', 'work', 'other'];
    let transLatedAddressTypes = [];
    for(let i=0; i < 3; i++) {
      transLatedAddressTypes.push({
        "addressKey": typeValues[i],
        "addressType": 'global.' + translationKeys[i]
      });
    }
    return transLatedAddressTypes;
  }
}
