var express = require('express');
var app = express();
var profile = require('./model/profile.js');
var recommender = require('./core/recommender.js');

app.get('/', function(req, res){	
	var perfil_puesto = new profile('1', [1,0,1], [1,0,1], [1,0,1]);	
	var perfiles_profesionales = [new profile('2', [0,0,0], [0,0,0], [0,0,0]),
								   new profile('3', [1,0,0], [1,0,0], [1,0,0]),
								   new profile('4', [1,0,1], [1,0,1], [1,0,1])];

	console.log(recommender.rContent(perfil_puesto,perfiles_profesionales,2));	
	
	console.log(recommender.rCollaborative(perfil_puesto,perfiles_profesionales,2));
								   	
	res.send('Cheka la consola, vamos =D!');
});

app.listen(3000);