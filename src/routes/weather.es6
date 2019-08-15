var express = require('express');

const base = "https://api.openweathermap.org/data/2.5/";
const request = require("request");
const config = global.config
const ipinfo = require('../api/ip');
const querystring = require('querystring');

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

            let request = require('request')
            let requestdata = {method: "get"}
            requestdata.url = base + endpoint + convertObjectToQueryString(params), "QS"
            console.log("Fetching..." + requestdata.url)


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

        router.get('/test', async function (req, res, next) {
            let result = await weatherApi.doRequest("weather?q=London")
            res.send(result);
        });


        router.get('/location', async function (req, res, next) {


            // let result = await weatherApi.doRequest({
            //     method: "get",
            //     url: base + "weather?q=London&appid=" + config.keyid
            // })

            // console.log(ipinfo)
            let ip = await ipinfo.getLocationInfo()

            let data = await weatherApi.doRequest("weather", {lat: ip.lat, lon: ip.lon})

            res.send(data);


        });


        return router;
    }


}


module.exports = weatherApi;
