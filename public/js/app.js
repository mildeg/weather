singleTemperature = {
    props: ["data"],
    template: `<div> 

    <h4 v-if="data.dt_txt">{{data.dt_txt}}</h4>
    
    <div><span>Temperatura:</span> {{data.main.temp}} C</div>
    <div><span>Minima: </span>{{data.main.temp_min}} C</div>
    <div><span>Maxima: </span>{{data.main.temp_max}} C</div>
   
 

</div>`

}

mainForecastComponent = {
    props: ["data"],
    template: `<div>
    <template v-if="data" >
        <div v-for="item in data.list">
    
            <single-temperature :data="item"></single-temperature>
            <br>
        </div>
    </template>

</div>`,

    components: {
        singleTemperature
    }

}

mainCurrentComponent = {
    props: ["data"],
    template: `<div>
    <template v-if="data" >
            <single-temperature :data="data"></single-temperature>
    </template>

</div>`,

    components: {
        singleTemperature
    }

}


const app = new Vue({
    el: "#app",
    template: `<div class="container">
    <div>
    
    
    <div class="field">
      <div class="control">
        <div class="select is-primary">
          <select v-model="type">
            <option value="forecast" >Forecast</option>
            <option value="current" >Clima actual</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="field">
      <div class="control">
        <div class="select is-primary">
          <select v-model="city">
            <option :value="null" >Actual</option>
            <option v-for="city in cities" :value="city.id" >{{city.name}}</option>
          </select>
        </div>
      </div>
    </div>
    
    
    
    <button class="btn button is-primary" @click="request">Consultar</button>
    </div>
    
    
    <div v-if="componentMount">
        <div v-bind:is="componentMount" :data="response"  ></div>
    </div>
    
    
    
    
</div>`,
    data: function () {
        return {
            response: null,
            cities: [
                {
                    "id": 3432039,
                    "name": "Partido de La Plata",
                    "country": "AR",
                    "coord": {
                        "lon": -58,
                        "lat": -35
                    }
                }, {
                    "id": 3860259,
                    "name": "Cordoba",
                    "country": "AR",
                    "coord": {
                        "lon": -64.181053,
                        "lat": -31.4135
                    }
                },
                {
                    "id": 3844419,
                    "name": "Provincia de Mendoza",
                    "country": "AR",
                    "coord": {
                        "lon": -68.5,
                        "lat": -34.5
                    }
                }, {
                    "id": 3441575,
                    "name": "Montevideo",
                    "country": "UY",
                    "coord": {
                        "lon": -56.167351,
                        "lat": -34.833462
                    }
                },
            ],
            city: null,
            type: "current",
            componentMount: "",

        }
    },
    methods: {

        request: async function () {
            this.response = null;
            try {
                let city = this.city ? this.city : ""
                let response = await axios.get(`/v1/${this.type}/${city}`)
                this.response = response.data;
                this.componentMount = this.type + "-component"
            } catch (e) {
                alert("No se pudo procesar la solicitud")
            }
        }

    },
    components: {
        "forecast-component": mainForecastComponent,
        "current-component": mainCurrentComponent
    }
})

