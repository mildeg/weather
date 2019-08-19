var express = require('express');

const base = "https://api.openweathermap.org/data/2.5/";
const request = require("request");
const config = global.config
const ipinfo = require('../modules/ip');
const querystring = require('querystring');
const cachemanager = require("../modules/cachemanager")
var convertObjectToQueryString = function (obj) {
    // Clone the object obj and loose the reference
    obj = Object.assign({}, obj);
    // if (!obj.access_token && _parameters.access_token) obj.access_token = _parameters.access_token;
    let result = querystring.stringify(obj)
    return result ? '?' + result : result;
}


class weatherApi {


    static doRequest(endpoint, params = {}) {


        return new Promise((resolve, reject) => {

            params.appid = config.keyid
            params.units = config.units
            let request = require('request')
            let requestdata = {method: "get"}
            requestdata.url = base + endpoint + convertObjectToQueryString(params), "QS"


            request(requestdata, function (err, res, body) {
                if (err) {
                    reject(err)
                    return;
                }
                try {

                    resolve(JSON.parse(body))
                } catch (e) {
                    console.error(body)
                    console.error(e)
                    resolve(null)
                }

            })

        })


    }


    static getRoutes() {

        var router = express.Router();


        router.get('/location/', async function (req, res, next) {

            let ip = await ipinfo.getLocationInfo()
            res.send(ip);


        });


        router.get('/current/:cityid*?', async function (req, res, next) {
            let response;

            let cityid = req.params.cityid;
            let redisHash;
            let queryparams;

            if (cityid) {
                redisHash = "location#" + cityid
                queryparams = {id: cityid}
            } else {
                let ip = await ipinfo.getLocationInfo()
                redisHash = "location"
                queryparams = {lat: ip.lat, lon: ip.lon}
            }


            let cached = await cachemanager.get(redisHash)
            if (cached) {
                res.send(JSON.parse(cached))
                return;
            }


            response = await weatherApi.doRequest("weather", queryparams)
            cachemanager.set(redisHash, JSON.stringify(response))

            res.send(response);

        });


        router.get('/forecast/:cityid*?', async function (req, res, next) {
            let response;

            let cityid = req.params.cityid;
            let redisHash;
            let queryparams;

            if (cityid) {
                redisHash = "location#forecast#" + cityid
                queryparams = {id: cityid}
            } else {
                let ip = await ipinfo.getLocationInfo()
                redisHash = "location#forecast"
                queryparams = {lat: ip.lat, lon: ip.lon}
            }


            let cached = await cachemanager.get(redisHash)
            if (cached) {
                res.send(JSON.parse(cached))
                return;
            }


            response = await weatherApi.doRequest("forecast", queryparams)
            cachemanager.set(redisHash, JSON.stringify(response))

            res.send(response);

        });

        return router;
    }


}

/* {
    "id": 3435910,
    "name": "Buenos Aires",
    "country": "AR",
    "coord": {
      "lon": -58.377232,
      "lat": -34.613152
    }
  },

 {
    "id": 3117735,
    "name": "Madrid",
    "country": "ES",
    "coord": {
      "lon": -3.70256,
      "lat": 40.4165
    }
  },

  {
    "id": 3451189,
    "name": "Estado do Rio de Janeiro",
    "country": "BR",
    "coord": {
      "lon": -42.5,
      "lat": -22
    }
  },
  {
    "id": 6356055,
    "name": "Barcelona",
    "country": "ES",
    "coord": {
      "lon": 2.12804,
      "lat": 41.399422
    }
  },

  {
    "id": 3441575,
    "name": "Montevideo",
    "country": "UY",
    "coord": {
      "lon": -56.167351,
      "lat": -34.833462
    }
  },*/

module.exports = weatherApi;
