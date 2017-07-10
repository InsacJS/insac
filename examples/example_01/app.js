var insac = require('../../');

let server = insac();

server.addModel({name:'autor', fields:['nombre','seudonimo','nacionalidad']});
server.addModel({name:'libro', fields:['titulo','editorial','nro_paginas']});

server.addResource('autor');
server.addResource('libro');

//server.migrate();
//server.generateApidoc();

server.init();
