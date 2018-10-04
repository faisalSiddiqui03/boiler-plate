export class Utils {
  private static _languageCode: string;

  static setLanguageCode(langCode: string) {
    Utils._languageCode = langCode;
  }

  static getLanguageCode(): string {
    return Utils._languageCode;
  }

  static isEmpty(obj): boolean {
    return !obj || Object.getOwnPropertyNames(obj).length === 0;
  }

  static getTimeHHMM(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const meridianString = hours < 12 ? 'am' : 'pm';
    const hourString = hours < 12 ? hours : hours - 12;
    const minString = minutes < 10 ? '0' + minutes : minutes;
    return hourString + ':' + minString + ' ' + meridianString;
  }

  static getDate(date: Date): string {
    const day = date.getDate();
    const daySting = day < 10 ? '0' + day : day;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
    ;
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return daySting + ' ' + month + ' ' + year;
  }
}
