import envConfig from './.env';

export const config = {
    "merchantId": "2002cbfe-9adf-42ac-9bfd-8e013fee7c18",
    "developerApiUrl": "http://www9.martjack.com/DeveloperAPI/",
    "base_dev_url": "http://www9.martjack.com/DeveloperAPI/",
    "frontendApiUrl": "https://sfapi-yum.martjack.com/V2/",
    "publicKey": "DQIT6SJJ",
    "secretKey": "NEOV9AGGGLYHERHRBSOTBROD",
    "googleMapsApiKey": "AIzaSyBw9J8qANj6wmVir3wu0vuFJHhwXiZDZk0",
    "countryCode": "KWT",
    "currencyCode": "KD",
    "redirects": {

    },
    "media_agility_url": "https://yum-india.appspot.com/_ah/api/storeApi/v1/getStoresMapping",
    "banner_base_url": "https://storage.pizzahut.me/yum-resources/2002cbfe-9adf-42ac-9bfd-8e013fee7c18/Images/userimages/pwa/",
    "media_agility_clientid": "5649391675244544",
    "media_agility_secretid": "V:}Q|IzuZL,k[YG%k\\@F",
    "media_agility_userid": "2746274274",
    "mongodb": {
      "host": "kishoret99:k0019625871@ds133627.mlab.com",
      "port": "33627",
      "db": "kt99-loopback"
    },
    "baseUrl": "/api/",
    "server": {
      "mw-static": {
        "maxAge": "1 day"
      }
    },
    "enableRedisCaching": false,
    "redis": {
      "host": "nightly-pwa-redis.8xcpns.ng.0001.euc1.cache.amazonaws.com",
      "port": "6379",
      "database": "1"
    },
    "graphite": {
      "host": "192.168.33.103",
      "port": "2003"
    },
    "logger":{
      "logging": {
        "default": {
          "console": {
            "level": "debug",
            "colorize": true,
            "timestamp": true
          }
        },
        "Server": {
          "dailyRotateFile": {
            "level": "debug",
            "colorize": false,
            "timestamp": true,
            "datePattern": "YYYY-MM-DD",
            "filename": "/var/log/capillary/test/server.log",
            "maxFiles": "10d",
            "maxsize": 100000000,
            "json": false
          }
        },
        "ACCESS": {
          "dailyRotateFile": {
            "level": "debug",
            "colorize": false,
            "timestamp": true,
            "datePattern": "YYYY-MM-DD",
            "filename": "/var/log/capillary/test/access.log",
            "maxFiles": "1d",
            "maxsize": 100000000,
            "json": false
          }
        },
        "BACKEND": {
          "dailyRotateFile": {
            "level": "debug",
            "colorize": false,
            "timestamp": true,
            "datePattern": "YYYY-MM-DD",
            "filename": "/var/log/capillary/test/backend.log",
            "maxFiles": "1d",
            "maxsize": 100000000,
            "json": false
          }
        },
        "ERROR": {
          "dailyRotateFile": {
            "level": "debug",
            "colorize": false,
            "timestamp": true,
            "datePattern": "YYYY-MM-DD",
            "filename": "/var/log/capillary/test/error.log",
            "maxFiles": "1d",
            "maxsize": 100000000,
            "json": false
          }
        },
        "FORENSIC": {
          "dailyRotateFile": {
            "level": "debug",
            "colorize": false,
            "timestamp": true,
            "datePattern": "YYYY-MM-DD",
            "filename": "/var/log/capillary/test/forensic.log",
            "maxFiles": "1d",
            "maxsize": 100000000,
            "json": false
          }
        }
      }
    },
    "cdn": {
      "enabled": true,
      "provider": "cloudfare"
    },
    "googleClientId" : "1040149251979-d892097h8nf8mnuitkv2acdf91vt9dq0.apps.googleusercontent.com"
  };

export const appConfig = {
  ...config,
  ...envConfig
};

