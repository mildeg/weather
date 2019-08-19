const should = require('should');
const minimist = require("minimist")
let args = minimist(process.argv.slice(2));
/*Para evitar posibles problemas al correr los test, se cambia el archivo de configuracion al estandar de testeo*/
if (!args.settingsfile) {
    process.argv.push("--settingsfile=config-test")
}

const app = require("../app")
const cachemanager = require("../src/modules/cachemanager")
const request = require('supertest');
const ip = require("../src/modules/ip")


describe("Location", function () {


    it("Location not null", async function () {

        const ip = require("../src/modules/ip")

        let json = await ip.getLocationInfo()

        should(json).be.not.null()

    })


    it("Location has ip", async function () {

        const ip = require("../src/modules/ip")

        let json = await ip.getLocationInfo()


        let regexp = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$")

        let validip = regexp.test(json.query)

        should(validip).be.equal(true, "Invalid ip")

    })

    it("Location saved in memory", async function () {


        ip.location = null;
        await ip.getLocationInfo()
        should(ip.location).be.not.null()

    })


})


let settings = args.settingsfile


describe("Redis Cache", function () {

    it("cache save get delete", async function () {

        let val = (Math.random() * 100).toFixed(2)
        await cachemanager.set("test#keyOne", val)

        let cachedValue = await cachemanager.get("test#keyOne")

        should(val).be.equal(cachedValue)

        /*limpieza del cache*/
        await cachemanager.remove("test#keyOne")

        let cleanValue = await cachemanager.get("test#keyOne")


        should(cleanValue).be.null()

    })


})


describe('Routing test', function () {

    it('location info', async function () {

        let response = await request(app).get('/v1/location')


        let stringResponse = response.text

        let mustResponse = JSON.stringify(await ip.getLocationInfo())


        should(stringResponse).be.equal(mustResponse)

    });


    it('current city info', async function () {

        let response = await request(app).get('/v1/current')
        let weatherData = JSON.parse(response.text)
        let location = await ip.getLocationInfo()

        should(weatherData.coord.lat.toFixed(2)).be.equal(location.lat.toFixed(2))
        should(weatherData.coord.lon.toFixed(2)).be.equal(location.lon.toFixed(2))


    });


    it('cordoba weather', async function () {

        let cordoba = {
            "id": 3860259,
            "name": "Cordoba",
            "country": "AR",
            "coord": {
                "lon": -64.181053,
                "lat": -31.4135
            }
        }

        let response = await request(app).get('/v1/current/' + cordoba.id)
        let weatherData = JSON.parse(response.text)

        should(weatherData).have.key("weather")
        should(cordoba.name).be.equal(weatherData.name)


    });


    it('cordoba forecast', async function () {

        let cordoba = {
            "id": 3860259,
            "name": "Cordoba",
            "country": "AR",
            "coord": {
                "lon": -64.181053,
                "lat": -31.4135
            }
        }

        let response = await request(app).get('/v1/forecast/' + cordoba.id)
        let weatherData = JSON.parse(response.text)
        should(weatherData).have.key("list")
        should(cordoba.name).be.equal(weatherData.city.name)


    });


    it('current forecast', async function () {


        let response = await request(app).get('/v1/forecast/')
        let weatherData = JSON.parse(response.text)
        should(weatherData).have.key("list")


        let location = await ip.getLocationInfo()
        should(location.countryCode).be.equal(weatherData.city.country)

    });


})
;
