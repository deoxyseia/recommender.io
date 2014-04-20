var result = require('../model/result.js');

exports.rContent = function(profile, alternatives, sizeResults){
	var results = [];
	var nowResult;
	var similarityMin = 0;
	var similarity = 0;

	console.log("\n\nMAKING RECOMMENDATION BASED-CONTENT\n");

	for (var i = 0; i < alternatives.length; i++) {
		similarity = cosineSimilarity(profile.vecPreference, alternatives[i].vecSelfDescription);

		if(similarity > similarityMin){
			nowResult = new result(alternatives[i], similarity);

			results.push(nowResult);
			results.sort(function(a,b){return a.score - b.score});

			if(results.length > sizeResults){
				results.shift();
			}

			similarityMin = results[0].score;				
		}		
	}

	return results.reverse();
}	

exports.rCollaborative = function(profile, alternatives, sizeResults){
	var results = [];
	var nowResult;
	var similarityMin = 0;
	var similarity = 0;	

	console.log("\n\nMAKING RECOMMENDATION BASED-COLLABORATIVE\n");	

	for (var i = 0; i < alternatives.length; i++) {
		similarity = cosineSimilarity(profile.vecPreference, alternatives[i].vecPreference)+
					 cosineSimilarity(profile.vecHistorical, alternatives[i].vecHistorical);

		if(similarity > similarityMin){
			nowResult = new result(alternatives[i], similarity);
			results.push(nowResult);
			results.sort(function(a,b){return a.score - b.score});	

			if(results.length > sizeResults){
				results.shift();
			}

			similarityMin = results[0].score;
		}		
	}
	
	return results.reverse();
}

exports.rReciprocity = function(profile, alternatives, sizeResults){	
	var results = [];
	var subSet = [];	
	var increase = 0;
	var maxIncrease = -1;
	var maxIndex = 0;

	console.log("\n\nMAKING RECOMMENDATION BASED-RECIPROCITY\n");

	while(alternatives.length>0 && subSet.length<sizeResults){
		for (var i = 0; i < alternatives.length; i++) {
			increase = evalFunction(profile, generateArray(subSet, alternatives[i])) - 
						evalFunction(profile, subSet);

			console.log("\nIncrease");	
			console.log(increase);		

			if(increase > maxIncrease){
				maxIncrease = increase;
				maxIndex = i;
			}		
		}
		
		var nowResult = new result(alternatives[maxIndex], maxIncrease);

		//Save the result
		results.push(nowResult);

		//Added alternative to subSet
		subSet.push(alternatives[maxIndex]);		
		
		//Remove alternative
		alternatives.splice(maxIndex, 1);

		maxIncrease = -1;	
	}

	//ordenamiento descendente
	results.sort(function(a,b){return b.score - a.score});
	
	return results;
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

//algorithms for based-reciprocity
function reciprocity(profileA, profileB){
	var result = cosineSimilarity(profileA.vecPreference, profileB.vecSelfDescription)*
		 	cosineSimilarity(profileB.vecPreference, profileA.vecSelfDescription);

	return result;	 	
}

function evalFunction(profile, set){
	console.log("\nStart evalFunction\n");
	console.log("profile");
	console.log(profile);
	console.log("set");
	console.log(set);

	var result = 0;
	var pivote = 0;

	if(set.length > 0){
		for (var i = 0; i < set.length; i++) {
			pivote = pivote +(1/set[i].recNumber)*reciprocity(profile, set[i]);
		};

		result = pivote/set.length;	
		pivote = 0;
	}

	if(set.length >= 2){
		var combs = k_combinations(set, 2);

		for (var i = 0; i < combs.length; i++) {
			console.log("\ncombinaciones individuales\n");
			console.log(combs[i]);
			pivote = pivote - cosineSimilarity(combs[i][0].vecSelfDescription, 
											   combs[i][1].vecSelfDescription)
		};

		pivote = pivote/combs.length;

		result = result + pivote;
	}

	console.log("\nResultado evalFunction");
	console.log(result);	

	return result;
}

function k_combinations(set, k) {
	var i, j, combs, head, tailcombs;
	
	if (k > set.length || k <= 0) {
		return [];
	}
	
	if (k == set.length) {
		return [set];
	}
	
	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}	
	// Assert {1 < k < set.length}
	
	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		head = set.slice(i, i+1);
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}

function generateArray(vec, item){
	var vecClone = JSON.parse( JSON.stringify( vec ) );
	vecClone.push(item);

	return vecClone;
}