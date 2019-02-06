var BrainJSClassifier = require('natural-brain');

let wordList=["akesi","ale ","esun","ijo","ilo","insa","jan","kala","kasi","kili","kiwen","ko","kon","kulupu","kute","lawa","len","linja","lipu","luka","lukin","oko","lupa","ma","mama","mani","meli","mi","mije","moku","monsi","mun","nanpa","nasin","nena","nimi","noka","ona","palisa","pan","pilin","pipi","poka","poki","selo","sijelo","sike","sina","sinpin","sitelen","soweli","suno","supa","telo","tenpo","tomo","uta","waso","alasa","jo","kalama","awen","kama","kalama","ken","kute","lawa","loje","lili","lukin","oko","moku","olin","open","pali","pana","pona","pu","sama","seli","sona","suwi","toki","tu","utala","wile","ala","ale ","anpa","ante","awen","ike","jaki","jelo","kama","ken","kule","lape","laso","lete","lili","loje","moli","musi","mute","nasa","ni","pakala","pilin","pimeja","pini","sike","sin","suli","taso","tawa","unpa","walo","wan","wawa","weka","a","anu","nanpa","e","en","la","li","mu","o","pi","seme","taso","kama","awen","ken","kepeken","lukin","oko","sona","wile","lon","kepeken","sama","tan","tawa"]

let dict={
	noun:["akesi","ale ","esun","ijo","ilo","insa","jan","kala","kasi","kili","kiwen","ko","kon","kulupu","kute","lawa","len","linja","lipu","luka","lukin","oko","lupa","ma","mama","mani","meli","mi","mije","moku","monsi","mun","nanpa","nasin","nena","nimi","noka","ona","palisa","pan","pilin","pipi","poka","poki","selo","sijelo","sike","sina","sinpin","sitelen","soweli","suno","supa","telo","tenpo","tomo","uta","waso"],
	verb:["alasa","jo","kalama","awen","kama","kalama","ken","kute","lawa","loje","lili","lukin","oko","moku","olin","open","pali","pana","pona","pu","sama","seli","sona","suwi","toki","tu","utala","wile"],
	adj:["ala","ale ","anpa","ante","awen","ike","jaki","jelo","kama","ken","kule","lape","laso","lete","lili","loje","moli","musi","mute","nasa","ni","pakala","pilin","pimeja","pini","sike","sin","suli","taso","tawa","unpa","walo","wan","wawa","weka"],
	particle:["a","anu","nanpa","e","en","la","li","mu","o","pi","seme","taso"],
	preVerb:["kama","awen","ken","kepeken","lukin","oko","sona","wile"],
	prep:["lon","kepeken","sama","tan","tawa"]
}

function wordNotInSentence(sentenceTokens,extraTokens){
	if (extraTokens) sentenceTokens = sentenceTokens.concat(extraTokens);
	return wordList.filter(word=>{if (sentenceTokens.indexOf(word)==-1) return word})
}


function generateWrongWordOrderSentences(goodTokens,outputQuantity){
	console.log('WrongWordOrder start')
	let output=[];
	//swap 1/2 of the words, choose 1/4
	for (let i=0;i<outputQuantity;i++){
		let wrongWordOrder=[...goodTokens]
		for (let j=0;j<Math.floor(goodTokens.length/4);j++){
			let pos1=Math.round(Math.random()*(wrongWordOrder.length-1))
			let pos2=Math.round(Math.random()*(wrongWordOrder.length-1))
			let word1= wrongWordOrder[pos1]
			let word2= wrongWordOrder[pos2]
			wrongWordOrder[pos1]=word2
			wrongWordOrder[pos2]=word1

		}
		output.push(wrongWordOrder)
	}
	console.log('WrongWordOrder end')

	//console.log("WrongWordOrder",output)
	return output
}

function generateMissingParticlesSentences(goodTokens,outputQuantity){
	//missing e, li etc 
}

function generateWrongWordsSentences(goodTokens,outputQuantity){
	//replace words with other words from the same part of speech
}

function generateUnintelligibleSentences(goodTokens,outputQuantity){
	let wrongWords = wordNotInSentence(goodTokens)
	let output=[];

		//wrong words and broken grammar
	for (let i=0;i<outputQuantity;i++){
		let len = 3+Math.round(Math.random()*5)
		let sen=''
		for (let j=0;j<len;j++){
			sen+=wrongWords[Math.round(Math.random()*(wrongWords.length-1))]+" "
		}
		output.push(sen)
	}

	//console.log("Unintelligible",output)
	return output
}

function generateWildCardSentences(goodTokens,outputQuantity){
	let output=[];
	for (let i=0;i<outputQuantity;i++){
		let goodTokensCopy=[...goodTokens]
		for (let j=0;j<goodTokens.length;j++){
			if (goodTokensCopy[j]=="*") {
				goodTokensCopy[j]=wordList[Math.floor(Math.random()*(wordList.length-1))]
			}
		}
		output.push(goodTokensCopy)
	}
	//console.log("WildCard",output)
	return output
}


// generateUnintelligibleSentences(['mi', 'kama', 'tan', 'ma'],50)
// generateWildCardSentences(['mi', 'kama', 'tan', 'ma',"*"],50)
// generateWrongWordOrderSentences(['mi', 'kama', 'tan', 'ma'],50)

function makeClassifier(obj){
	console.log('making classifier')
	var classifier = new BrainJSClassifier();
	Object.keys(obj).forEach(out=>{
		obj[out].forEach(input=>{
			classifier.addDocument(input,out);
		})
	})
	classifier.train();
	return classifier
}


function testClassifier(classifier,arr){
	console.log('testing classifier')
	arr.forEach(input=>{
		console.log('input: ',input)
		console.log('output: ',classifier.classify(input))
	})
}

// let whereFrom = makeClassifier({
// 	'unintelligible':['adsf ma asdf lkjfdsa','afds aslkfdj lkafd'],
// 	'broken':['____ma kama','____ma kama mi'],
// 	'so-so':['___ kama tan ma ___','___tan ma'],
// 	'good':['mi kama tan ma ___','mi tan ma ___']
// })

// let whereFrom = makeClassifier({
// 	'unintelligible':generateUnintelligibleSentences(['mi', 'kama', 'tan', 'ma'],10),
// 	'WrongWordOrder':generateWrongWordOrderSentences(['mi', 'kama', 'tan', 'ma'],10),
// 	'good':['mi kama tan ma','mi kama ma','mi lon ijo']
// 	//'good':generateWildCardSentences(['mi', 'kama', 'tan', 'ma',"*"],50)
// })

// testClassifier(
// 	whereFrom,
// 	['mi kama asdas as dasd sa dasd asd tan ma  ',
// 	'mi kama asdas as dasd sa dasd tan ma  ',
// 	'mi kama asdas as dasd sa tan ma  ',
// 	'mi kama asdas as tan ma  ',
// 	'mi kama asdas tan ma  ',
// 	'mi kama tan ma nu yake',
// 	'nu yake!!!!!!!!!!! mi kama ma ',
// 	'nu yake mi kama',
// 	'mi lon jan nu yake',
// 	'adsf dsa ads afds sf',
// 	'where are you from?',
// 	'kama ni yake ma nu tan',
// 	'mi kama adsfafds tan ma asdadf',
// 	'tan ma nu yake',
// 	'nu yake',
// 	'mi lon ijo nu yake',
// 	'mi moku e nu yake',
// 	'mi moku nu yake'
// 	]
// )



//non-ML

function evaluateMeaning(input,models,guidelines){
	let preprocessedInput=input.toLowerCase().split(' ')
	//initial check - are grammar and vocab both correct?
	models.forEach(model=>{
		let preprocessedModel = model.toLowerCase().split(' ')
		preprocessedModel.forEach(lex=>{
			if (lex=='seme' || lex=='?') console.log('is question')
		})
		preprocessedModel = preprocessedModel.filter(lex=>{
			if (lex!='!' && lex!=',' && lex!='.') return lex
		})
		//debugger;
		let length=preprocessedModel.length
		let inputIndex=0,score=0
		preprocessedModel.forEach((lex,modelIndex)=>{
			if (lex=='$'){
				inputIndex+=1
				score+=1
			}
			else if (lex=='*'&& preprocessedModel[modelIndex+1]){
				score+=1
				while (preprocessedModel[modelIndex+1]!=preprocessedInput[inputIndex]){
					inputIndex+=1
				}
			}
			else if (lex=='*'&& !preprocessedModel[modelIndex+1]){
				score+=1
			}
			else if(lex==preprocessedInput[inputIndex]){
				score+=1
				inputIndex+=1
			}
		})
		let percent=(score/length)*100
		console.log(preprocessedInput,preprocessedModel,percent+"%")
	})
	//second check: are guidelines followed?

	//third check: is model vocabulary used?

	//if first check passes, correct,
	//check: if I remove words, does it match?
	//if second check or third check passes, respond but first provide parrot
	//if all fail, prompt for another reply, misunderstand, or disengage
}

//* variable number of words
// //$ one word
// let output = evaluateMeaning(
// 	'mi kama tan ma Nu Yaka',
// 	['mi tan ma *','mi kama tan ma *'],
// 	{positions:['mi','?',]}
// )

// console.log(output)
