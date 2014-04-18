var result = require('../model/result.js');

exports.rContent = function(vec, alternatives, sizeResults){
	var bestSimilaties = [];
	var nowResult;
	var similarityMin = 0;
	var similarity = 0;

	console.log("\n\nMaking recommendation based-content\n");

	for (var i = 0; i < alternatives.length; i++) {
		similarity = cosineSimilarity(vec.vecPreference, alternatives[i].vecSelfDescription);

		if(similarity > similarityMin){
			nowResult = new result(alternatives[i], similarity);

			bestSimilaties.push(nowResult);
			bestSimilaties.sort(function(a,b){return a.similarity - b.similarity});

			if(bestSimilaties.length > sizeResults){
				bestSimilaties.shift();
			}

			similarityMin = bestSimilaties[0].similarity;				
		}		
	}

	return bestSimilaties.reverse();
}	

exports.rCollaborative = function(vec, alternatives, sizeResults){
	var bestSimilaties = [];
	var nowResult;
	var similarityMin = 0;
	var similarity = 0;	

	console.log("\n\nMaking recommendation based-collaborative\n");	

	for (var i = 0; i < alternatives.length; i++) {
		similarity = cosineSimilarity(vec.vecPreference, alternatives[i].vecPreference)+
					 cosineSimilarity(vec.vecHistorical, alternatives[i].vecHistorical);

		if(similarity > similarityMin){
			nowResult = new result(alternatives[i], similarity);
			bestSimilaties.push(nowResult);
			bestSimilaties.sort(function(a,b){return a.similarity - b.similarity});	

			if(bestSimilaties.length > sizeResults){
				bestSimilaties.shift();
			}

			similarityMin = bestSimilaties[0].similarity;
		}		
	}
	
	return bestSimilaties.reverse();
}


//Intern methods
function cosineSimilarity(vecA, vecB){	
	var resultado  = scalarProduct(vecA, vecB) / (vecMagnitude(vecA) * vecMagnitude(vecB));
	
	return resultado;
}

function scalarProduct(vecA, vecB){
	var product = 0;
	for (var i = 0; i < vecA.length; i++) {
		product += vecA[i] * vecB[i];
	}

	return product;
}

function vecMagnitude(vec){
	var sum = 0;
	for (var i = 0; i < vec.length; i++) {
		sum += vec[i] * vec[i];
	}
	
	return Math.sqrt(sum);
}




