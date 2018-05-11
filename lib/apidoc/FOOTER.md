# Instrucciones de uso

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

| Tipo | Código | Titulo | Mensaje | Causa |
|------|--------|--------|---------|-------------|
| `BAD_REQUEST` | 400 | Petición incorrecta | Hubo un error al procesar su solicitud, revise el formato en el envío de datos e inténtelo nuevamente. | Ocurre cuando algún dato de entrada no tiene el formato correcto. |
| `UNAUTHORIZED` | 401 | Acceso no autorizado | Debe autenticarse para acceder al recurso. | Ocurre cuando se intenta acceder a un recurso privado. |
| `FORBIDDEN` | 403 | Acceso denegado | No cuenta con los privilegios suficientes para acceder al recurso. | Ocurre cuando se intenta acceder a un recurso privado, utilizando una credencial incorrecta. |
| `NOT_FOUND` | 404 | Recurso no disponible | El servidor no puede encontrar el recurso solicitado. | Ocurre generalmente cuando el registro no existe o ha sido eliminado. |
| `CONFLICT` | 409 | Conflicto | Hubo un error durante el proceso, inténtelo nuevamente. | Ocurre generalmente cuando el registro ha sido modificado y no se puede continuar con el proceso. |
| `PRECONDITION_FAILED` | 412 | Condición insuficiente | No se cumple con algunas condiciones que son necesarias para completar la tarea. | Ocurre cuando no se cumple con ciertas condiciones (validaciones lógicas), por lo general cuando los datos de entrada en conjunto no tienen un sentido lógico. |
| `INVALID_TOKEN` | 498 | Token inválido | El token es inválido | Ocurre generalmente cuando el token ha expirado. |
| `INTERNAL_SERVER` | 500 | Error interno | Hubo un error inesperado, inténtelo mas tarde. | Este error nunca debería ocurrir, generalmente son errores desconocidos que no han sido controlados. |

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
