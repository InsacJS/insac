define({
  "name": "Aplicación INSAC",
  "version": "1.0.0",
  "description": "Ejemplo de creación de un servicio web con INSAC",
  "title": "Apidoc · INSAC",
  "url": "http://localhost:7000",
  "header": {
    "title": "INICIO",
    "content": "<h1>Consideraciones acerca del uso de la API</h1>\n<h3>Códigos de respuesta</h3>\n<ul>\n<li><code>200</code> <strong>Ok</strong>. La petición se ha completado con éxito.</li>\n<li><code>201</code> <strong>Created</strong>. La petición se ha completado con éxito y como resultado ha creado un recurso.</li>\n<li><code>400</code> <strong>Bad Request</strong>. El servidor no es capaz de entender la petición porque su sintaxis no es correcta.</li>\n<li><code>401</code> <strong>Unauthorized</strong>. El recurso solicitado requiere de autenticación.</li>\n<li><code>403</code> <strong>Forbidden</strong>. El servidor no puede responder con el recurso solicitado porque se ha denegado el acceso.</li>\n<li><code>404</code> <strong>Not Found</strong>. El servidor no puede encontrar el recurso solicitado.</li>\n<li><code>422</code> <strong>Unprocessable Entity</strong>. La petición tiene el formato correcto, pero sus contenidos tienen algún error semántico.</li>\n<li><code>500</code> <strong>Internal Server Error</strong>. Se ha producido un error interno.</li>\n</ul>\n<h3>Métodos HTTP aceptados:</h3>\n<table>\n<thead>\n<tr>\n<th>Método</th>\n<th>Descripción</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>GET</code></td>\n<td>Obtiene un recurso o lista de recursos</td>\n</tr>\n<tr>\n<td><code>POST</code></td>\n<td>Crea un recurso</td>\n</tr>\n<tr>\n<td><code>PUT</code></td>\n<td>Actualiza un recurso</td>\n</tr>\n<tr>\n<td><code>DELETE</code></td>\n<td>Elimina un recurso</td>\n</tr>\n</tbody>\n</table>\n<h3>Opciones de una consulta:</h3>\n<table>\n<thead>\n<tr>\n<th>Opción</th>\n<th>Descripción</th>\n<th>Valor por defecto</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>fields</code></td>\n<td>Nombres de los atributos devueltos.</td>\n<td><code>all</code></td>\n</tr>\n<tr>\n<td><code>offset</code></td>\n<td>Posición inicial.</td>\n<td><code>0</code></td>\n</tr>\n<tr>\n<td><code>limit</code></td>\n<td>Nro. Máximo de recursos devueltos.</td>\n<td><code>50</code></td>\n</tr>\n<tr>\n<td><code>sort</code></td>\n<td>Ordena el resultado (<code>field+asc</code>, <code>field+desc</code>)</td>\n<td><code>&lt;ninguno&gt;</code></td>\n</tr>\n<tr>\n<td><code>&lt;field&gt;</code></td>\n<td>Consulta simple (<code>field=valor</code>)</td>\n<td><code>&lt;ninguno&gt;</code></td>\n</tr>\n</tbody>\n</table>\n<h4>Ejemplos de consulta utilizando la opción <code>fields</code>:</h4>\n<ul>\n<li><code>/personas</code></li>\n<li><code>/personas?fields=all</code></li>\n<li><code>/personas?fields=id,ci</code></li>\n<li><code>/personas?fields=id,ci,usuario()</code></li>\n<li><code>/personas?fields=id,ci,usuario(all)</code></li>\n<li><code>/personas?fields=all,usuario(id,username)</code></li>\n<li><code>/personas?fields=usuario(all,roles_usuarios())</code></li>\n<li><code>/personas?fields=usuario(id,roles_usuarios(id))</code></li>\n<li><code>/personas?fields=usuario(roles_usuarios(id,rol(id)))</code></li>\n<li><code>/personas?fields=all,usuario(all,roles_usuarios(all))</code></li>\n</ul>\n<h4>Nota.-</h4>\n<ul>\n<li>EL campo <code>all</code> incluirá a todos los campos del objeto, excluyendo aquellos campos que representan objetos.</li>\n<li>Para realizar una consulta con todos los campos posibles, puede utilizar la opción <code>fields=ALL</code>.</li>\n</ul>\n<h4>Ejemplos de consulta utilizando condiciones:</h4>\n<ul>\n<li><code>/personas</code></li>\n<li><code>/personas?id=1</code></li>\n<li><code>/personas?id=1,2,3</code></li>\n<li><code>/personas?nombre=jhon</code></li>\n<li><code>/personas?usuario.username=admin</code></li>\n<li><code>/personas?usuario.roles_usuarios.rol.alias=admin</code></li>\n</ul>\n<h4>Nota.-</h4>\n<ul>\n<li>Al aplicar filtros en un objeto, puede que el resultado no incluya al objeto, esto significa que dicho objeto no cumple con las condiciones, por lo tanto, una vez aplicada la condición habrá que verificar que el objeto exista y sea diferente de <code>null</code>.</li>\n</ul>\n<h4>Ejemplos de consulta utilizando las opciones <code>offset</code> y <code>limit</code>:</h4>\n<ul>\n<li><code>/personas?offset=0&amp;limit=50</code></li>\n</ul>\n<h4>Ejemplos de consulta utilizando la opción <code>sort</code>:</h4>\n<ul>\n<li><code>/personas?sort=id+asc</code></li>\n<li><code>/personas?sort=nombre+asc,paterno+asc,materno+asc</code></li>\n<li><code>/personas?sort=ci+desc</code></li>\n</ul>\n<h4>Nota.-</h4>\n<ul>\n<li>La opción sort solo funciona en campos de primer nivel, es decir no funciona con campos que se encuentren dentro de un objeto.</li>\n</ul>\n<h3>Respuesta exitosa</h3>\n<p>Todas las respuestas se enviarán con el código <code>200 Ok</code> (Si esta opción está activada, de no ser asi, se devolverá el mismo código que aparece en el cuerpo de la respuesta), el código final se incluirá en el cuerpo de la respuesta el cual tendrá el siguiente formato:</p>\n<pre><code class=\"language-json\">HTTP/1.1 200 Ok\n{\n  &quot;status&quot;: &quot;OK&quot;,\n  &quot;code&quot;: 200,\n  &quot;data&quot;: [],\n  &quot;metadata&quot;: {\n    &quot;limit&quot;: 50,\n    &quot;offset&quot;: 0,\n    &quot;total&quot;: 1,\n    &quot;count&quot;: 1\n  }\n}\n</code></pre>\n<h4>Nota.-</h4>\n<ul>\n<li>\n<p>El valor de la propiedad <code>status</code> siempre será <code>OK</code>.</p>\n</li>\n<li>\n<p>La propiedad <code>code</code> puede tener los valores <code>200</code> o <code>201</code>, dependiendo, si es una operación exitosa ó si se crea un nuevo registro con exito.</p>\n</li>\n<li>\n<p>El valor de la propiedad <code>data</code> puede ser un objeto o un array de objetos.</p>\n</li>\n<li>\n<p>Si la petición se realizó sobre un recurso (tiene asignado un modelo) y la respuesta contiene un array de objetos, también se incluirá la propiedad <code>metadata</code> con la siguiente información.</p>\n<ul>\n<li><code>limit</code>: Cantidad máxima de registros a devolver.</li>\n<li><code>offset</code>: Posición desde la que se devolveran los datos.</li>\n<li><code>total</code>: Cantidad total de registros sin filtros.</li>\n<li><code>count</code>: Cantidad de registros devueltos.</li>\n</ul>\n</li>\n</ul>\n<h3>Respuesta con error</h3>\n<p>Cuando exista algún tipo de error, la respuesta se enviará con el código <code>200 Ok</code> (Si esta opción está activada, de no ser asi, se devolverá el mismo código que aparece en el cuerpo de la respuesta), el código de error se incluirá en el cuerpo de la respuesta con el siguiente formato:</p>\n<pre><code class=\"language-json\">HTTP/1.1 200 Ok\n{\n  &quot;status&quot;: &quot;FAIL&quot;,\n  &quot;code&quot;: 422,\n  &quot;type&quot;: &quot;Unprocessable Entity&quot;,\n  &quot;message&quot;: &quot;Algunos datos no son válidos&quot;\n}\n</code></pre>\n<h4>Nota.-</h4>\n<ul>\n<li>El valor de la propiedad <code>status</code> siempre será <code>FAIL</code>.</li>\n</ul>\n<h1>Roles de usuario</h1>\n<p>El servicio web cuenta con los siguientes tipos de usuario:</p>\n<table>\n<thead>\n<tr>\n<th>Nombre</th>\n<th>Alias</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>Administrativo</code></td>\n<td><code>admin</code></td>\n</tr>\n<tr>\n<td><code>Docente</code></td>\n<td><code>doc</code></td>\n</tr>\n<tr>\n<td><code>Estudiante</code></td>\n<td><code>est</code></td>\n</tr>\n</tbody>\n</table>\n<h1>Descripción de los modelos</h1>\n<h3>rol</h3>\n<p>Modelo que representa a un rol de usuario</p>\n<table>\n<thead>\n<tr>\n<th>Atributo</th>\n<th>Tipo de dato</th>\n<th>Descripción</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>id</code> [ PK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único</td>\n</tr>\n<tr>\n<td><code>nombre</code></td>\n<td><code>STRING</code></td>\n<td>Nombre</td>\n</tr>\n<tr>\n<td><code>alias</code></td>\n<td><code>STRING</code></td>\n<td>Alias</td>\n</tr>\n<tr>\n<td><code>descripcion</code></td>\n<td><code>STRING</code></td>\n<td>Breve descripción acerca del rol</td>\n</tr>\n</tbody>\n</table>\n<h3>usuario</h3>\n<p>Modelo que representa a un usuario del sistema</p>\n<table>\n<thead>\n<tr>\n<th>Atributo</th>\n<th>Tipo de dato</th>\n<th>Descripción</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>id</code> [ PK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único</td>\n</tr>\n<tr>\n<td><code>username</code></td>\n<td><code>STRING</code></td>\n<td>Usuario</td>\n</tr>\n<tr>\n<td><code>password</code></td>\n<td><code>STRING</code></td>\n<td>Contraseña</td>\n</tr>\n<tr>\n<td><code>nombre</code></td>\n<td><code>STRING</code></td>\n<td>Nombre completo</td>\n</tr>\n<tr>\n<td><code>email</code></td>\n<td><code>STRING</code></td>\n<td>Dirección de correo electrónico</td>\n</tr>\n</tbody>\n</table>\n<h3>rol_usuario</h3>\n<p>Modelo que describe todos los roles de un determinado usuario</p>\n<table>\n<thead>\n<tr>\n<th>Atributo</th>\n<th>Tipo de dato</th>\n<th>Descripción</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>id</code> [ PK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único</td>\n</tr>\n<tr>\n<td><code>estado</code></td>\n<td><code>STRING</code></td>\n<td>Estado de la cuenta</td>\n</tr>\n<tr>\n<td><code>id_usuario</code> [ FK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único del registro 'usuario'</td>\n</tr>\n<tr>\n<td><code>id_rol</code> [ FK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único del registro 'rol'</td>\n</tr>\n</tbody>\n</table>\n<h3>persona</h3>\n<p>Modelo que representa a una persona</p>\n<table>\n<thead>\n<tr>\n<th>Atributo</th>\n<th>Tipo de dato</th>\n<th>Descripción</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>id</code> [ PK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único</td>\n</tr>\n<tr>\n<td><code>nombre</code></td>\n<td><code>STRING</code></td>\n<td>Nombre completo</td>\n</tr>\n<tr>\n<td><code>paterno</code></td>\n<td><code>STRING</code></td>\n<td>Apellido paterno</td>\n</tr>\n<tr>\n<td><code>materno</code></td>\n<td><code>STRING</code></td>\n<td>Apellido materno</td>\n</tr>\n<tr>\n<td><code>ci</code></td>\n<td><code>INTEGER</code></td>\n<td>Cédula de identidad</td>\n</tr>\n<tr>\n<td><code>email</code></td>\n<td><code>STRING</code></td>\n<td>Dirección de correo electrónico</td>\n</tr>\n<tr>\n<td><code>direccion</code></td>\n<td><code>STRING</code></td>\n<td>Dirección de domicilio</td>\n</tr>\n<tr>\n<td><code>telefono</code></td>\n<td><code>INTEGER</code></td>\n<td>Número de teléfono o celular</td>\n</tr>\n<tr>\n<td><code>id_usuario</code> [ FK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único del registro 'usuario'</td>\n</tr>\n</tbody>\n</table>\n<h3>carrera</h3>\n<p>Modelo que representa a una carrera universitaria</p>\n<table>\n<thead>\n<tr>\n<th>Atributo</th>\n<th>Tipo de dato</th>\n<th>Descripción</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>id</code> [ PK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único</td>\n</tr>\n<tr>\n<td><code>nombre</code></td>\n<td><code>STRING</code></td>\n<td>Nombre</td>\n</tr>\n</tbody>\n</table>\n<h3>administrativo</h3>\n<p>Modelo que representa a un personal administrativo</p>\n<table>\n<thead>\n<tr>\n<th>Atributo</th>\n<th>Tipo de dato</th>\n<th>Descripción</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>id</code> [ PK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único</td>\n</tr>\n<tr>\n<td><code>cargo</code></td>\n<td><code>STRING</code></td>\n<td>Cargo o puesto administrativo</td>\n</tr>\n<tr>\n<td><code>id_persona</code> [ FK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único del registro 'persona'</td>\n</tr>\n</tbody>\n</table>\n<h3>docente</h3>\n<p>Modelo que representa a un docente</p>\n<table>\n<thead>\n<tr>\n<th>Atributo</th>\n<th>Tipo de dato</th>\n<th>Descripción</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>id</code> [ PK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único</td>\n</tr>\n<tr>\n<td><code>item</code></td>\n<td><code>INTEGER</code></td>\n<td>Nro de item</td>\n</tr>\n<tr>\n<td><code>grado</code></td>\n<td><code>STRING</code></td>\n<td>Grado académico</td>\n</tr>\n<tr>\n<td><code>carga_horaria</code></td>\n<td><code>INTEGER</code></td>\n<td>Carga horaria</td>\n</tr>\n<tr>\n<td><code>tipo_contratacion</code></td>\n<td><code>STRING</code></td>\n<td>Tipo de contratación</td>\n</tr>\n<tr>\n<td><code>tipo_docente</code></td>\n<td><code>STRING</code></td>\n<td>Tipo de indica si es docente: investigador, de cátedra, o ambos</td>\n</tr>\n<tr>\n<td><code>id_persona</code> [ FK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único del registro 'persona'</td>\n</tr>\n</tbody>\n</table>\n<h3>estudiante</h3>\n<p>Modelo que representa a un estudiante</p>\n<table>\n<thead>\n<tr>\n<th>Atributo</th>\n<th>Tipo de dato</th>\n<th>Descripción</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>id</code> [ PK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único</td>\n</tr>\n<tr>\n<td><code>ru</code></td>\n<td><code>INTEGER</code></td>\n<td>Nro de registro universitario</td>\n</tr>\n<tr>\n<td><code>id_persona</code> [ FK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único del registro 'persona'</td>\n</tr>\n<tr>\n<td><code>id_carrera</code> [ FK ]</td>\n<td><code>INTEGER</code></td>\n<td>Identificador único del registro 'carrera'</td>\n</tr>\n</tbody>\n</table>\n<h1>Descripción de los recursos y las rutas</h1>\n"
  },
  "footer": {},
  "template": {
    "withGenerator": true,
    "withCompare": false,
    "forceLanguage": "es"
  },
  "sampleUrl": false,
  "defaultVersion": "0.0.0",
  "apidoc": "0.3.0",
  "generator": {
    "name": "apidoc",
    "time": "2017-10-03T20:37:36.632Z",
    "url": "http://apidocjs.com",
    "version": "0.17.6"
  }
});
