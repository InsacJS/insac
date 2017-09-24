# Consideraciones acerca del uso de la API

### Códigos de respuesta

- `200` **Ok**. La petición se ha completado con éxito.
- `201` **Created**. La petición se ha completado con éxito y como resultado ha creado un recurso.
- `400` **Bad Request**. El servidor no es capaz de entender la petición porque su sintaxis no es correcta.
- `401` **Unauthorized**. El recurso solicitado requiere de autenticación.
- `403` **Forbidden**. El servidor no puede responder con el recurso solicitado porque se ha denegado el acceso.
- `404` **Not Found**. El servidor no puede encontrar el recurso solicitado.
- `422` **Unprocessable Entity**. La petición tiene el formato correcto, pero sus contenidos tienen algún error semántico.
- `500` **Internal Server Error**. Se ha producido un error interno.

### Métodos HTTP aceptados:

| Método   | Descripción                            |
|----------|----------------------------------------|
| `GET`    | Obtiene un recurso o lista de recursos |
| `POST`   | Crea un recurso                        |
| `PUT`    | Actualiza un recurso                   |
| `DELETE` | Elimina un recurso                     |

### Opciones de una consulta:

| Opción    | Descripción                                     | Valor por defecto |
|-----------|-------------------------------------------------|-------------------|
| `fields`  | Nombres de los atributos devueltos.             | `all`             |
| `offset`  | Posición inicial.                               | `0`               |
| `limit`   | Nro. Máximo de recursos devueltos.              | `50`              |
| `sort`    | Ordena el resultado (`field+asc`, `field+desc`) | `<ninguno>`       |
| `<field>` | Consulta simple (`field=valor`)                 | `<ninguno>`       |

#### Ejemplos de consulta utilizando la opción `fields`:

- `/personas`
- `/personas?fields=all`
- `/personas?fields=id,ci`
- `/personas?fields=id,ci,usuario()`
- `/personas?fields=id,ci,usuario(all)`
- `/personas?fields=all,usuario(id,username)`
- `/personas?fields=usuario(all,roles_usuarios())`
- `/personas?fields=usuario(id,roles_usuarios(id))`
- `/personas?fields=usuario(roles_usuarios(id,rol(id)))`
- `/personas?fields=all,usuario(all,roles_usuarios(all))`

#### Nota.-
- EL campo `all` incluirá a todos los campos del objeto, excluyendo aquellos campos que representan objetos.
- Para realizar una consulta con todos los campos posibles, puede utilizar la opción `fields=ALL`.

#### Ejemplos de consulta utilizando condiciones:

- `/personas`
- `/personas?id=1`
- `/personas?id=1,2,3`
- `/personas?nombre=jhon`
- `/personas?usuario.username=admin`
- `/personas?usuario.roles_usuarios.rol.alias=admin`

#### Nota.-
- Al aplicar filtros en un objeto, puede que el resultado no incluya al objeto, esto significa que dicho objeto no cumple con las condiciones, por lo tanto, una vez aplicada la condición habrá que verificar que el objeto exista y sea diferente de `null`.

#### Ejemplos de consulta utilizando las opciones `offset` y `limit`:
- `/personas?offset=0&limit=50`

#### Ejemplos de consulta utilizando la opción `sort`:
- `/personas?sort=id+asc`
- `/personas?sort=nombre+asc,paterno+asc,materno+asc`
- `/personas?sort=ci+desc`

#### Nota.-
- La opción sort solo funciona en campos de primer nivel, es decir no funciona con campos que se encuentren dentro de un objeto.
