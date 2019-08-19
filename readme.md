### Weather App

##### Instalacion

* clonar el repositorio. ``` git clone https://github.com/mildeg/weather.git ```
* instalar los paquetes npm   ``` npm install ```
* iniciar el servidor ```npm start```

Por defecto la aplicacion iniciara en el puerto 4040, puede modificarse desde el archivo `config.json`

Para correr los tests, se puede usar el comando preparado `npm test`

##### Consideraciones

* Para obtener la ubicacion actual se toma la del servidor y no la del usuario,ya que sin leventar la aplicacion 
como servicio http externo no era posible obtenerla.
* Como entre ip-api y weather no hay un codigo general que se pueda usar para obtener
los datos de la ciudad actual, se usan latitud y longitud para corroborar que sean correctos
los datos obtenidos.


##### Cache

* La aplicacion para almacenar los datos actuales de localizacion de ip-api una vez consultados,
 los guarda en memoria ya que se tiene en cuenta que no van a cambiar minimo, hasta que se reinicie el servidor.

* Los datos de weather, en cambio se almacenan en un cache de redis con expiracion a 10 minutos. Este es el tiempo que
en el que weather indica no habra cambios en su api, ya que su informacion se renueva cada 10 minutos.

##### Configuracion

 Se admiten 4 de configuraciones
 
 - *keyid* : es la key que usara el servidor para conectarse al api de weather.
 - *port*: el puerto en que la app estara funcional.
 - *units*: las unidades de la temperatura, puede ser cualquiera de las proporcionadas por weather 
 `(se tiene en cuenta que estaran bien especificadas y no se controla)`
- *redis-key* : es la llave que usara redis como prefijo para poder cambiar el almacenamiento en cache,
usado actualmente para que los tests no realicen cambios en el cache de produccion.



