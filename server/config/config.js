const config = {
  "merchantId": "2002cbfe-9adf-42ac-9bfd-8e013fee7c18",
  "developerApiUrl": "http://eu.ecom.capillary.in/developerapi/",
  "base_dev_url": "http://eu.ecom.capillary.in/developerapi/",
  "frontendApiUrl": "http://eu-fapi.ecom.capillary.in/V2",
  "frontendApiUrlV3": "https://eu-frontapi.ecom.capillary.in/v3",
  "publicKey": "DQIT6SJJ",
  "secretKey": "NEOV9AGGGLYHERHRBSOTBROD",
  "googleMapsApiKey": "AIzaSyBw9J8qANj6wmVir3wu0vuFJHhwXiZDZk0",
  "defaultStoreId": 13264,
  "countryCode": "KWT",
  "redirects": {},
  "media_agility_url": "https://yum-india.appspot.com/_ah/api/storeApi/v1/getStoresMapping",
  "media_agility_clientid": "5649391675244544",
  "media_agility_secretid": "V:}Q|IzuZL,k[YG%k\\@F",
  "media_agility_userid": "2746274274",
  "mongodb": {
    "host": "kishoret99:k0019625871@ds133627.mlab.com",
    "port": "33627",
    "db": "kt99-loopback"
  },
  "baseUrl": "http://localhost:3000/api/",
  "server": {
    "mw-static": {
      "maxAge": "1 day"
    }
  },
    "prerender": {
      "token": "Aa9bwxzH40uPNZRBPpC9"
    },
  "enableRedisCaching": false,
  "redis": {
    "host": "production-pwa-redis.8xcpns.ng.0001.euc1.cache.amazonaws.com",
    "port": "6379",
    "database": "1"
  },
  "graphite": {
    "host": "192.168.33.103",
    "port": "2003",
    "prefix" : "pwa.phkuwait"
  },
  "logger": {
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
        },
        "console": {
          "level": "debug",
          "colorize": true,
          "timestamp": true
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
        },
        "console": {
          "level": "debug",
          "colorize": true,
          "timestamp": true
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
        },
        "console": {
          "level": "debug",
          "colorize": true,
          "timestamp": true
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
        },
        "console": {
          "level": "debug",
          "colorize": true,
          "timestamp": true
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
        },
        "console": {
          "level": "debug",
          "colorize": true,
          "timestamp": true
        }
      }
    }
  },
  "cdn": {
    "enabled": true,
    "provider": "cloudfare"
  },
  "isAsapEnabled": true,
  "attributes": [{
    "id": 18,
    "name": "IsImmediateOrder"
  },
    {
      "id": 32,
      "name": "channelid"
    }],
  "intouchCluster" : "https://api.capillary.co.in",
  "survey": {
    "credentials": {
      "username": "kn.003",
      "password": "202cb962ac59075b964b07152d234b70"
    },
    "to": "shanuj.bansal@capillarytech.com",
    "subject": "Order Feedback"
  }
};

module.exports = config;
