var insac = require('../../');
var path = require('path');

let app = insac();

app.serverConfig({publicFolder:path.join(__dirname,'public')});
app.databaseConfig({username:'postgres', password:'BK8DJ567F0', dbname:'insac_example_01'});

app.model({name:'autor', pluralName:'autores', fields:[
  'nombre',
  {name:'seudonimo', validators:[{name:'len', args:[2,10]}]},
  {name:'nacionalidad', validators:[{name:'isIn', args:['ARGENTINA', 'BRASIL', 'BOLIVIA', 'ECUADOR']}], default:'BOLIVIA'}
]});

app.resource({modelName:'autor', routes:[
  {method:'GET', outputs:['id', 'nombre', 'seudonimo', 'nacionalidad']},
  {method:'GET', outputs:['nombre', 'seudonimo', 'nacionalidad'], idParam:true},
  {method:'POST', inputs:['nombre', 'seudonimo']},
  {method:'PUT'},
  {method:'DELETE'}
]});

/*app.resource({modelName:'autor', version:2, routes:[
{method:'POST', inputs:['nombre', 'seudonimo']}
]});*/

app.migrate();
app.init();
