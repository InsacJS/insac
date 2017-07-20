const insac = require('../../');
const path = require('path');

let DataType = insac.DataType;
let app = insac();

let config = {
  response: {all200: true},
  server: {publicFolder: path.join(__dirname,'public')},
  database: {dbname: 'insac_example_01', username: 'postgres', password: 'BK8DJ567F0'}
}

app.setConfig(config);

app.addModel({name:'autor', pluralName:'autores', fields:[
  {name:'nombre'},
  {name:'seudonimo', unique:true, validators:[{name:'len', args:[2,10]}]},
  {name:'nacionalidad', validators:[{name:'isIn', args:[['ARGENTINA', 'BRASIL', 'BOLIVIA', 'ECUADOR']]}], default:'BOLIVIA'}
]});

app.addResource({modelName:'autor', routes:[
  {method:'GET', outputs:['id', 'nombre', 'seudonimo', 'nacionalidad']},
  {method:'GET', outputs:['nombre', 'seudonimo', 'nacionalidad'], idParam:true},
  {method:'POST', inputs:['nombre', 'seudonimo']},
  {method:'PUT'},
  {method:'DELETE'}
]});

app.addModel({name:'libro', fields:[
  {name:'titulo', upperCase:true, primaryKey:true},
  {name:'editorial', lowerCase:true, primaryKey:true},
  {name:'nro_paginas', type:DataType.INTEGER},
  {name:'fecha_registro', type:DataType.DATE},
  {name:'id_autor', reference:'autor'}
]});

app.addResource('libro');

//app.migrate(['autor','libro']);
app.init();
