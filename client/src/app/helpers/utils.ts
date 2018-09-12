export class Utils {
  private static _languageCode: string;

  static setLanguageCode(langCode: string) {
    Utils._languageCode = langCode;
  }

  static getLanguageCode(): string {
    return Utils._languageCode;
  }

  static isEmpty(obj): boolean {
    return Object.getOwnPropertyNames(obj).length === 0
  }
}
