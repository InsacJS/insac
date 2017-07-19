# INSAC
INSAC, es un framework de creación de servicios web que utilizan la arquitectura REST, desarrollado en Javascript.

# Objetivo
Desarrollar una herramienta que permita crear servicios web de forma simple, sin complicaciones técnicas.

# Tecnologías utilizadas
- Express como servidor
- Sequelize como ORM

# Configuración de la zona horaria del servidor
En el servidor configurar la zona horaria con los siguientes comandos:

$ `tzselect`

Para que los cambios sean permanentes adicionar la siguiente línea al archivo: `/home/user/.profile`

`TZ='America/La_Paz'; export TZ`

ver el estado:

$ `timedatectl status`

Actualiza la zona horaria

$ `sudo dpkg-reconfigure tzdata`

# Envio de fechas desde el cliente
Cuando se trabaja con fechas, se debe enviar una fecha con la hora del servidor.
Se crea una fecha desde la maquina del usuario y luego se convierte a la hora del servidor.
``` js
var momentTZ = require('moment-timezone');
var serverTimezone = 'America/La_Paz';
let serverTime = momentTZ().clone().tz(serverTimezone).format();
```
