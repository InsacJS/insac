# Instrucciones de uso de la API

## Respuesta exitosa
``` json
{
 "status": "success",
 "message": "La tarea ha sido completada exitosamente.",
 "metadata": {
   "count": 100
 },
 "data": "Objeto o Array de objetos"
}
```

| Campo            | Descripción                                                                                        |
|------------------|----------------------------------------------------------------------------------------------------|
| `status`         | Siempre será `success`. Indica que la tarea se completó con éxito.                                 |
| `message`        | Describe el resultado obtenido. **Puede mostrarse al cliente** como el título de una notificación. |
| `metadata`       | Metadatos adicionales. **[OPCIONAL]**                                                              |
| `metadata.count` | Cantidad de registros existentes. **[OPCIONAL]**                                                   |
| `data`           | Contiene el resultado.                                                                             |

## Respuesta con error
``` json
{
 "status": "error",
 "message": "Error de validación",
 "errors": [
   {
     "path": "body.usuario.usename",
     "value": "abc",
     "msg": "El nombre de usuario debe tener entre 4 y 12 caracteres.",
     "dev": "El campo 'username' debe tener entre 4 y 12 caracteres."
   }
 ]
}
```

| Campo          | Descripción                                                        |
|----------------|--------------------------------------------------------------------|
| `status`       | Siempre será `error`. Indica que el proceso finalizó con un error. |
| `message`      | Describe el tipo de error. **Puede mostrarse al cliente**          |
| `errors`       | Lista de errores.                                                  |
| `errors.path`  | Ruta del campo que produjo el error. **[OPCIONAL]**                |
| `errors.value` | Valor del campo que produjo el error. **[OPCIONAL]**               |
| `errors.msg`   | Describe la causa del error. **Puede mostrarse al cliente**        |
| `errors.dev`   | Información para el desarrollador. **[OPCIONAL]**                  |

## Tipos de Error

| Tipo                    | Código | Titulo              | Mensaje | Causa |
|-------------------------|--------|---------------------|---------|-------------|
| `BAD_REQUEST_ERROR`     | 400    | Error de validación | Algunos campos no son válidos. | El valor de un campo de entrada no tiene el formato correcto. |
| `AUTHORIZATION_ERROR`   | 401    | Error de acceso     | Debe autenticarse para acceder al recurso. | Ocurre cuando se intenta acceder a un recurso privado. |
| `FORBIDDEN_ERROR`       | 403    | Error de acceso     | No cuenta con los privilegios suficientes para acceder al recurso. | Ocurre cuando se intenta acceder a un recurso privado, utilizando una credencial incorrecta. |
| `PRECONDITION_ERROR`    | 412    | Error de proceso    | No se cumple con algunas condiciones, necesarias para completar la tarea. | Este error puede ocurrir por diversas razones, por ejemplo: cuando se intenta acceder a un registro que no existe, cuando se intenta modificar un registro cuyo estado no permite mas modificaciones, por lo general cuando los datos de entrada en conjunto no tienen un sentido lógico. |
| `INTERNAL_SERVER_ERROR` | 500    | Error interno       | Hubo un error inesperado, inténtelo mas tarde. | Este error nunca debería ocurrir, y si ocurre debe informarse al encargado de sistemas. |

## Métodos HTTP aceptados

| Método   | Descripción                                    |
|----------|------------------------------------------------|
| `GET`    | Devuelve un registro o una lista de registros. |
| `POST`   | Crea un registro.                              |
| `PUT`    | Actualiza un registro.                         |
| `DELETE` | Elimina un registro.                           |

## Filtros de una consulta

| Filtro    | Descripción                                     | Valor por defecto |
|-----------|-------------------------------------------------|-------------------|
| `fields`  | Campos que serán devueltos en el resultado.     | `all`             |
| `limit`   | Cantidad de registros por página.               | `50`              |
| `page`    | Número de página.                               | `0`               |
| `order`   | Ordena el resultado (`field`, `-field`)         | `<ninguno>`       |
| `<field>` | Consulta simple (`field=valor`)                 | `<ninguno>`       |

### Modo de uso del filtro `fields`

Todos los campos.
- `/personas`
- `/personas?fields=all`

Todos los campos. Incluyendo a los objetos.
- `/personas?fields=ALL`

Todos los campos, excluyendo algunos.
- `/personas?fields=-_fecha_creacion,-_fecha_modificacion`
- `/personas?fields=-id,-ci`

Incluyendo objetos.
- `/personas?fields=usuario()`
- `/personas?fields=usuario(id,username)`
- `/personas?fields=usuario(roles(rol()))`

Incluyendo consultas. **[ required = false ]**
- `/personas?fields=id,nombre=john`
- `/personas?fields=id,usuario(roles(estado=ACTIVO))`

### Modo de uso del filtro `<field>`

Incluyendo consultas. **[ required = true ]**
- `/personas?id=1`
- `/personas?id=1,2,3`
- `/personas?nombre=john`
- `/personas?usuario.username=admin`
- `/personas?usuario.roles.estado=ACTIVO`

#### Nota.-
Al incluir consultas sobre un objeto (`usuario(estado=ACTIVO)` o `usuario.estado=ACTIVO`), si el objeto no cumple con la condición, el valor de este campo será `undefined` y si la condición es requerida el registro al que pertenece el objeto no se incluirá en el resultado.

### Modo de uso de los filtros `limit` y `page`

Devuelve una cierta cantidad de registros, indicando el número de página.
- `/personas?limit=50&page=1`

### Modo de uso del filtro `order`

Devuelve una lista ordenada de forma ascendente `field` o descendente `-field`.
- `/personas?order=id`
- `/personas?order=-ci`
- `/personas?order=nombre,paterno,materno`
- `/personas?order=-_fecha_creacion,-_fecha_modificacion`
