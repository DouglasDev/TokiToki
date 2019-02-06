let wordList=["akesi","ale ","esun","ijo","ilo","insa","jan","kala","kasi","kili","kiwen","ko","kon","kulupu","kute","lawa","len","linja","lipu","luka","lukin","oko","lupa","ma","mama","mani","meli","mi","mije","moku","monsi","mun","nanpa","nasin","nena","nimi","noka","ona","palisa","pan","pilin","pipi","poka","poki","selo","sijelo","sike","sina","sinpin","sitelen","soweli","suno","supa","telo","tenpo","tomo","uta","waso","alasa","jo","kalama","awen","kama","kalama","ken","kute","lawa","loje","lili","lukin","oko","moku","olin","open","pali","pana","pona","pu","sama","seli","sona","suwi","toki","tu","utala","wile","ala","ale ","anpa","ante","awen","ike","jaki","jelo","kama","ken","kule","lape","laso","lete","lili","loje","moli","musi","mute","nasa","ni","pakala","pilin","pimeja","pini","sike","sin","suli","taso","tawa","unpa","walo","wan","wawa","weka","a","anu","nanpa","e","en","la","li","mu","o","pi","seme","taso","kama","awen","ken","kepeken","lukin","oko","sona","wile","lon","kepeken","sama","tan","tawa"]

let dict={
	noun:["akesi","ale ","esun","ijo","ilo","insa","jan","kala","kasi","kili","kiwen","ko","kon","kulupu","kute","lawa","len","linja","lipu","luka","lukin","oko","lupa","ma","mama","mani","meli","mi","mije","moku","monsi","mun","nanpa","nasin","nena","nimi","noka","ona","palisa","pan","pilin","pipi","poka","poki","selo","sijelo","sike","sina","sinpin","sitelen","soweli","suno","supa","telo","tenpo","tomo","uta","waso"],
	verb:["alasa","jo","kalama","awen","kama","kalama","ken","kute","lawa","loje","lili","lukin","oko","moku","olin","open","pali","pana","pona","pu","sama","seli","sona","suwi","toki","tu","utala","wile"],
	adj:["ala","ale ","anpa","ante","awen","ike","jaki","jelo","kama","ken","kule","lape","laso","lete","lili","loje","moli","musi","mute","nasa","ni","pakala","pilin","pimeja","pini","sike","sin","suli","taso","tawa","unpa","walo","wan","wawa","weka"],
	particle:["a","anu","nanpa","e","en","la","li","mu","o","pi","seme","taso"],
	preVerb:["kama","awen","ken","kepeken","lukin","oko","sona","wile"],
	prep:["lon","kepeken","sama","tan","tawa"]
}

function generateNGramsOfLength(tokens,ngramLength){
	let ngrams=[];
	for (let position=0;position<=tokens.length-ngramLength;position++){
		ngrams.push(tokens.slice(position,position+ngramLength))
	}
	return ngrams
}

function generateAllNGrams(tokens){
	let allNGrams=[]
	for (let len=tokens.length;len>0;len--){
		let grams = generateNGramsOfLength(tokens,len)
		allNGrams =allNGrams.concat(grams)
	}
	return allNGrams
}


//only works if wildcards are spaced at least 2 apart
function removeWildcardWords(modelTokens, inputTokens){
	let output = inputTokens
	//generate threegrams centered around wild card, remove all characters in between or before or after
	let threes =  generateNGramsOfLength(modelTokens,3)
	//chop off beginning
	if (modelTokens[0]=='*') {
		for (let i=0;i<inputTokens.length-2;i++){
			if (inputTokens[i+1]==threes[0][1] && inputTokens[i+2]==threes[0][2]){
				output=output.slice(i+1,inputTokens.length-i+1)
			}
		}
	}

	//chop off end
	if (modelTokens[modelTokens.length-1]=='*') {
		for (let i=modelTokens.length-3;i>1;i--){
		//	console.log(output[i+1],threes[threes.length-1][0])
		//	console.log(output[i+2],threes[threes.length-1][1])
			if (output[i+1]==threes[threes.length-1][0] && output[i+2]==threes[threes.length-1][1]){
				output=output.slice(0,i+3)
			}
		}
	}	
	
	//cut out middle ---only if words aren't in original sentence
	let WildThrees=threes.filter((three,index)=>three[1]=='*' && index!=0 && index!=(threes.length-1))

	WildThrees.forEach(three=>{
		for (let i=0;i<output.length;i++){
			//debugger
			if (output[i]==three[0]){
				for (let j=i+1;j<output.length;j++){
					if (output[j]==three[2]){
						let first=output.slice(0,i+1)
						let last=output.slice(j,output.length)
						output = first.concat(last)
					}
				}
			}
			
		}
	})

	// output = inputTokens.filter(token=>modelTokens.indexOf(token)>-1)
	return output
}


//good for word order
function getPercentMatch(model,sentence){
	let modelTokens=model.split(' ')
	modelTokensWithOutWildcards=modelTokens.filter(token=>token!='*')
	let sentenceTokens=sentence.split(' ')

	let sentenceWithoutWildcards = removeWildcardWords(modelTokens,sentenceTokens)
	let allNgramsInSentence=generateAllNGrams(sentenceWithoutWildcards)
	let allNgramsInModel=generateAllNGrams(modelTokensWithOutWildcards)

	let topScore=0,score=0,	joinedSentences=[]
	// console.log('model without wildcards',modelTokensWithOutWildcards,'sentenceWithoutWildcards',sentenceWithoutWildcards)

// //n gram is given probability weight proportional to its length, meaning an n-gram of length 4 is worth 4 times as much as 4 n-gram of length 1.
// 	allNgramsInModel.forEach((gram)=>{
// 		topScore+=gram.length
// 	})
	
// 	allNgramsInSentence.forEach((sentence,index)=>{joinedSentences[index]=sentence.join('')})

// 	allNgramsInModel.forEach(gram=> {
// 		let joinedGram = gram.join('')
// 		if (joinedSentences.indexOf(joinedGram)>-1){
// 			score+=gram.length
// 		}
// 	})
// /////

//all n grams have equal weight
	topScore = allNgramsInModel.length
	
	allNgramsInSentence.forEach((sentence,index)=>{joinedSentences[index]=sentence.join('')})

	allNgramsInModel.forEach(gram=> {
		let joinedGram = gram.join('')
		if (joinedSentences.indexOf(joinedGram)>-1){
			score+=1
		}
	})
/////
	console.log('percent',100*score/topScore)
	return 100*score/topScore
}


function getWordSimilarity(modelString,sentence){
	let score=0
	let modelTokens=modelString.split(' ')
	modelTokensWithOutWildcards=modelTokens.filter(token=>token!='*')
	let sentenceTokens=sentence.split(' ')

	let sentenceWithoutWildcards = removeWildcardWords(modelTokens,sentenceTokens)

	// console.log('model without wildcards',modelTokensWithOutWildcards,'sentenceWithoutWildcards',sentenceWithoutWildcards)
	//get same words
	let correctTokens=modelTokensWithOutWildcards.filter(token=>sentenceWithoutWildcards.indexOf(token)>-1)
	let same=correctTokens.length
	//get different words
	let differentElements=sentenceWithoutWildcards.filter(token=>modelTokensWithOutWildcards.indexOf(token)==-1)
	let different = differentElements.length
	let total=same+different
	let missingElements=modelTokensWithOutWildcards.filter(token=>sentenceWithoutWildcards.indexOf(token)==-1)
	let missing=missingElements.length
	score=100*(same-different/2-missing/2)/same
	console.log(score)
	return score

}

//getPercentMatch('* mi kama tan ma *', 'adsf dsa mi kama sd e li dadadfdsas a tan ma new york')

function testSentences(model,sentences){
	console.log('test sentence ngrams')
	console.log('model',model)
	sentences.forEach(sentence=>{
		console.log('sentence',sentence)
		getPercentMatch(model, sentence)
	})
}

function testWordSimilarity(model,sentences){
	console.log('test word similarity')
	console.log('model',model)
	sentences.forEach(sentence=>{
		console.log('sentence',sentence)
		getWordSimilarity(model, sentence)
	})
}


function testNgramAndWordSimilarityCombo(model,sentences){
	console.log('testNgramAndWordSimilarityCombo')
	console.log('model',model)
	sentences.forEach(sentence=>{
		console.log('sentence',sentence)
		let wordSimilarity =getWordSimilarity(model, sentence)
		let percentMatch = getPercentMatch(model, sentence)
		console.log('avg',(wordSimilarity+percentMatch)/2)
	})
}




testSentences('* mi kama tan ma tomo *',
	[
	'adsf dsa mi kama sd e li dadadfdsas a tan ma tomo new york',
	'mi kama tan ma tomo New York',
	'mi New York kama tan ma',
	'mi tan ma tomo New York',
	'mi kama ma New York',
	'New York mi kama',
	'Im from New York',
	])


testWordSimilarity('* mi kama tan ma tomo *',
	[
	'adsf dsa mi kama sd e li dadadfdsas a tan ma tomo new york',
	'mi kama tan ma tomo New York',
	'mi New York kama tan ma',
	'mi tan ma tomo New York',
	'mi kama ma New York',
	'New York mi kama',
	'Im from New York',
	])
testNgramAndWordSimilarityCombo('* mi kama tan ma tomo *',
	[
	'adsf dsa mi kama sd e li dadadfdsas a tan ma tomo new york',
	'mi kama tan ma tomo New York',
	'mi New York kama tan ma',
	'mi tan ma tomo New York',
	'mi kama ma New York',
	'New York mi kama',
	'Im from New York',
	])

// console.log(removeWildcardWords('* mi kama tan * ma tomo *'.split(' '), 'qw wq mi kama tan assad as d ma tomo New York'.split(' ')))