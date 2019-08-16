const should = require('should');
const app = require("../app.js")
const cachemanager = require("../lib/modules/cachemanager")


describe("Location", function () {

    before(async () => {

        await app.ready
        console.log("app iniciada")

    });

    it("Location not null", async function () {

        const ip = require("../lib/modules/ip")

        let json = await ip.getLocationInfo()

        should(json).be.not.null()

    })


    it("Location has ip", async function () {

        const ip = require("../lib/modules/ip")

        let json = await ip.getLocationInfo()


        let regexp = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$")

        let validip = regexp.test(json.query)

        should(validip).be.equal(true, "Invalid ip")

    })

    it("Location saved in memory", async function () {

        const ip = require("../lib/modules/ip")
        ip.location = null;
        await ip.getLocationInfo()
        should(ip.location).be.not.null()

    })


})


describe("Redis Cache", function () {

    it("cache save get delete", async function () {

        let val = (Math.random() * 100).toFixed(2)
        await cachemanager.set("test#keyOne", val)

        let cachedValue = await cachemanager.get("test#keyOne")

        should(val).be.equal(cachedValue)

        /*limpieza del cache*/
        await cachemanager.remove("test#keyOne")

        let cleanValue = await cachemanager.get("test#keyOne")

        console.log(cleanValue)

        should(cleanValue).be.null()

    })


})
