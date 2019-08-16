class ip {

    static setLocationInfo() {

        let cls = this;
        return new Promise((resolve, reject) => {
            const request = require('request')
            let requestdata = {method: "get", url: "http://ip-api.com/json/"}

            request(requestdata, function (err, res, body) {
                if (err) {
                    reject(err)
                    return;
                }
                try {
                    cls.location = JSON.parse(body)
                    console.log("ip location setted")
                    resolve()
                } catch (e) {
                    console.error(e)
                    resolve(null)
                }

            })

        })

    }

    static async getLocationInfo() {
        /*Ya que la ip del servidor en tiempo de ejecucion no va a cambiar, se consulta una unica vez en el startup*/

        if (!this.location) {
            await this.setLocationInfo()
        }

        return this.location
    }


}

module.exports = ip