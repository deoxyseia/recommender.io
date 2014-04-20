var express = require('express');
var app = express();
var profile = require('./model/profile.js');
var recommender = require('./core/recommender.js');

app.get('/', function(req, res){	
	var perfil_puesto = new profile('1', [1,0,1], [1,0,1], [1,0,1], 1);	
	var perfiles_profesionales = [new profile('2', [1,1,1], [1,1,1], [1,1,1], 1),
								   new profile('3', [1,0,0], [1,0,0], [1,0,0], 1),
								   new profile('4', [1,0,1], [1,0,1], [1,0,1], 1)];

	var contentResult = recommender.rContent(perfil_puesto,perfiles_profesionales,2);
	console.log(contentResult);	

	var collabResult = recommender.rCollaborative(perfil_puesto,perfiles_profesionales,2);
	console.log(collabResult);

	var reciResult = recommender.rReciprocity(perfil_puesto,perfiles_profesionales,2);
	console.log(reciResult);
								   	
	res.send('Cheka la consola, vamos =D!');
});

app.listen(3000);