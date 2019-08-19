let config = global.config;

class cachemanager {


    static async remove(key) {
        if (this.started) {
            await this.startPromise
        }

        return new Promise((resolve, reject) => {
            this.redis.del(config["redis-key"] + "#" + key, function (err, reply) {
                if (err) {
                    reject(err)
                } else {
                    resolve(reply)
                }
            });

        })
    }

    static async set(key, value) {
        if (this.started) {
            await this.startPromise
        }
        return new Promise((resolve, reject) => {
            this.redis.set(config["redis-key"] + "#" + key, value, function (err, reply) {
                if (err) {
                    reject(err)
                } else {
                    /*los datos de openweather se actualizan cada 10 minutos, por lo que redis las almacenara durante este tiempo*/
                    cachemanager.redis.expire(key, 10 * 60);
                    // cachemanager.redis.expire(key, 5);

                    resolve(reply)
                }
            });

        })
    }

    static async get(key) {
        if (this.started) {
            await this.startPromise
        }
        return new Promise((resolve, reject) => {
            this.redis.get(config["redis-key"] + "#" + key, function (err, reply) {
                if (err) {
                    reject(err)
                } else {
                    resolve(reply)
                }
            });

        })


    }

}

cachemanager.redis = null

module.exports = cachemanager