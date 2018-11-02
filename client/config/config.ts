import envConfig from './.env';

export const config = {
  'googleMapsApiKey': 'AIzaSyAl29VXAA5U34fAKFaQ9dEaxTJbA-Mxo8A',
  'currencyCode': 'KD',
  'banner_base_url': 'https://martjackyumstorage.azureedge.net/stage-resources/2002cbfe-9adf-42ac-9bfd-8e013fee7c18/Images/userimages/',
  'sizePropertyId': 1940,
  'maxToppingLimit': 3,
  'minToppingLimit': 3,
  'dealCategoryId': 'CU00215646',
  'headerBannerRefCode': 'ph-60th-years-',
  'footerBannerRefCode': 'bogo-pwa-',
  'quantityEnabledCategories': ['CU00215602'],
  'baseUrl': '/api/',
  'tracker': {
    'widgetImpression': false,
    'apiTrack': false
  },
  'googleClientId': '1040149251979-d892097h8nf8mnuitkv2acdf91vt9dq0.apps.googleusercontent.com',
  'address': {
    'storeSep': ' , Map Location: '
  },
  'seo': {
    'aboutUs': {
      'keywords': ['About Pizzahut'],
      'title': 'About Us - Pizzahut Kuwait',
      'description': 'This needs to be updated.',
      'urlKey': ''
    },
    'contactUs': {
      'keywords': ['Contact Pizzahut'],
      'title': 'Contact Us - Pizzahut Kuwait',
      'description': 'This needs to be updated.',
      'urlKey': ''
    },
    'faq': {
      'keywords': ['About Pizzahut'],
      'title': 'Frequently Asked Questions - Pizzahut Kuwait',
      'description': 'This needs to be updated.',
      'urlKey': ''
    },
    'feedback': {
      'keywords': ['About Pizzahut'],
      'title': 'Feedback - Pizzahut Kuwait',
      'description': 'This needs to be updated.',
      'urlKey': ''
    },
    'nutrition': {
      'keywords': ['About Pizzahut'],
      'title': 'Nutirion Information - Pizzahut Kuwait',
      'description': 'This needs to be updated.',
      'urlKey': ''
    },
    'privacyPolicy': {
      'keywords': ['About Pizzahut'],
      'title': 'Privacy Policy - Pizzahut Kuwait',
      'description': 'This needs to be updated.',
      'urlKey': ''
    },
    'termsAndConditions': {
      'keywords': ['About Pizzahut'],
      'title': 'Terms & Conditions - Pizzahut Kuwait',
      'description': 'This needs to be updated.',
      'urlKey': ''
    }
  }
};

export const appConfig = {
  ...config,
  ...envConfig
};
