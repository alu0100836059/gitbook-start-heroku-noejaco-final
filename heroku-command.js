#! /usr/bin/env node

var fs = require('fs');
var path = require('path');
var child = require("child_process");
var exec = require('child_process').exec;
var prompt = require("prompt");
var heroku = require('heroku-client');

function initialize(directorio) {

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
    datos_usuario(directorio);

};



function datos_usuario(directorio){

     // Pedimos a través del prompt el nombre de la app y el token
      var git = require('simple-git')(path.join(process.cwd()));

       prompt.get([{
              name: 'nombre_app',
              required: true
            },{
              name: 'token_app',
              required: true
            },{
                name: 'repositorio'
            }], function (err, result) {
            //
            // Log the results.
            //
            console.log('\nProcesando los siguientes datos:\n');
            console.log('\tNombre de la aplicación: ' + result.nombre_app + "\n");
            console.log('\tToken de la aplicación: ' + result.token_app + "\n");
            console.log('\tDirección del repositorio: ' + result.repositorio + "\n");

            //variable con el contenido de config.json
            var json = '{\n "Heroku":{\n\t"nombre_app": "'+result.nombre_app+'",\n\t "token_app": "'+result.token_app+'"\n\t}\n}';

            fs.mkdirSync(path.join(process.cwd(), ".token_heroku"));
            fs.writeFileSync(path.join(process.cwd(),".token_heroku","token.json"),json);

            var token = require(path.join(process.cwd(), ".token_heroku","token.json"));
            var pack= require(path.join(process.cwd(), 'package.json'));

            var her = new heroku({ token : token.Heroku.token_app });

                her.post('/apps', {body: {name: token.Heroku.nombre_app}} ).then(app => {

                    //git.init().addRemote('heroku', result.repositorio).add('.').commit('Primer commit').push('heroku','master');



                });

          });

}

function deploy() {



    console.log("Comenzando el deploy en HEROKU");



    child.exec('git add . ; git commit -m "subiendo a heroku"; git push heroku master;', function(error, stdout, stderr){
        if(error)
          console.log(error)

        console.log(stderr);
        console.log(stdout);
      });



};

module.exports = {
  initialize,
  deploy
}
