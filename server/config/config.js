const config = {
        "merchantId": "2002cbfe-9adf-42ac-9bfd-8e013fee7c18",
        "developerApiUrl": "http://www9.martjack.com/DeveloperAPI/",
        "base_dev_url": "http://www9.martjack.com/DeveloperAPI/",
        "frontendApiUrl": "https://sfapi-yum.martjack.com/V2/",
        "frontendApiUrlV3": "http://yum-stagefapi.martjack.com/v3/",
        "publicKey": "DQIT6SJJ",
        "secretKey": "NEOV9AGGGLYHERHRBSOTBROD",
        "googleMapsApiKey": "AIzaSyBw9J8qANj6wmVir3wu0vuFJHhwXiZDZk0",
        "defaultStoreId": 13264,
        "countryCode": "KWT",
        "redirects": {

        },
        "media_agility_url": "https://yum-india.appspot.com/_ah/api/storeApi/v1/getStoresMapping",
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
            "host": "production-pwa-redis.8xcpns.ng.0001.euc1.cache.amazonaws.com",
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
        }
    };

module.exports = config;
