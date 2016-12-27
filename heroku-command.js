#! /usr/bin/env node

var fs = require('fs');
var path = require('path');
var child = require("child_process");

function initialize(directorio){

    var nueva_tarea='\ngulp.task("deploy-heroku-token", function () {'+
        '\n\tvar heroku = require("gitbook-start-heroku-noejaco-final");'+
        '\n\tvar url = paquete.repository.url;'+
        '\n\n\ heroku.deploy();'+
        '\n});\n\n';


    // Añadimos la tarea al gulpfile.js
    fs.writeFileSync(path.resolve(process.cwd(),'gulpfile.js'), nueva_tarea,  {'flag':'a'},  function(err) {
        if (err) {
            return console.error(err);
        }
    });
  };

  function deploy() {

    console.log("Desplegando...");

    child.exec('git add . ; git commit -m "Despliegue a Heroku"; git push heroku master;', function(error, stdout, stderr){
        if(error)
          console.log(error)
    });

};

module.exports = {
  initialize,
  deploy
}
