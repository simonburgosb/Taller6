# Pasos para realizar los experimentos

## Servidor

Este proyecto implementa un servidor web al que añade funcionalidades de Websocket usando socket.io. 
El servir gestionará las solicitudes de páginas web y además la conexión socket.io (websocket) con los 
clientes. La tarea del servidor web es servir dos 
posibles sitios: un sitio móvil y un sitio de escritorio. El sitio 
móvil leerá la posición x,y del sensor touch del celular y la enviará al socket.io. 
Si hay un cliente de escritorio corriendo el sitio web de escritorio, este podría recibir la información 
del touch del cliente móvil. Con esta información, pintará un círculo en la posición x,y recibida. 
De nuevo, la comunicación entre los dos sitios se realizará mediante socket.io.

* El archivo server.js contiene el código del servidor.
* En la carpeta public están los dos sitios web: mobile y desktop.

Los pasos para ejecutar la aplicación son:

* Clonar el repositorio.

* Abre el repositorio en Visual Studio Code (VSC)

* Abre la **Terminal** de VSC para ejecutar los sigiuentes comandos.

* Instalar las dependencias con el comando

``` bash
npm install
```

* Ejecutar el servidor con:

``` bash
npm start
```
* Realiza un **Forward a port** en Visual Studio Code mediante la pestaña **PORTS** y el puerto 3000 (este es el que está configurado en el archivo server.js)

* Cambia la visibilidad de la URL expuesta a **Public**. Ten presente 
que si lo dejas Private tendrás que autenticarte con tus credenciales de github tanto 
en tu computador (sitio web de escritorio) como en tu celular (sitio web móvil)

* Toma nota de la URL que te da **Forward a port**. Esta la necesitarás en el celular.

* Abre la página web en el computador

``` js
http://localhost:3000/desktop/
https://URL EN FORWARD A PORT/mobile/
```
