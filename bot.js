var HTTPS = require('https');
var weather = require('yahoo-weather');
var giphy = require('giphy-api')();
var botID = process.env.BOT_ID;

function respond() {
	var request = JSON.parse(this.req.chunks[0]),

	// Commands Here:
	weatherRegex = /^\/stan weather/;
	wallRegex = /^\/wall/;
	buckIsCommunistRegex = /^\/redscare/;
	gifRegex = /^\/gif/;
	
	if(request.text && weatherRegex.test(request.text)) {
		this.res.writeHead(200);
		console.log(request.text);	
		var location = request.text.substring(14, request.text.length);
		console.log(location);
		// weather_command(location); -- under construction and idk what to do anymore.
		this.res.end();
		
	} else if(request.text && wallRegex.test(request.text)) { // WALL
		this.res.writeHead(200);
		postImage("@Mexico", "https://d1sui4xqepm0ps.cloudfront.net/is-this-meme-racist-full.jpg?image=cdn");
		this.res.end();
		
	} else if(request.text && buckIsCommunistRegex.test(request.text)) { 
		this.res.writeHead(200);
		postMessage("@Andrew Buck is a communist");
		this.res.end();
		
	} else if(request.text && gifRegex.test(request.text)){
		this.res.writeHead(200);
		var key = request.text.substring(5, request.text.length);
		gif_command(key);
		this.res.end();
	} else {
		console.log("don't care");
		this.res.writeHead(200);
		this.res.end();
	}
  
}

function weather_command(loc){
	var botResponse;

	// Options:
	// search:     location name or zipcode
	// degreeType: F or C
	
	/*
	weather(loc, 'f').then( function(info){
		botReposnse = info.item.title;
		postMessage(botReposnse);
		
		botReposnse = "Currently: " + info.item.condition.text + " " + info.item.condition.temp + "°F";
		postMessage(botReposnse);
		
		botReposnse = info.item.forecast[0].date + ": has a high/low of " + info.item.forecast[0].high + "°F/" + info.item.forecast[0].low +"°F";
		postMessage(botReposnse);
		
	
		
	}).catch( function(err) {
		console.log(err);
		throw err; 	
	});*/
	
	

	/*weather.find({search: loc, degreeType: 'F'}, function(err, result) {
		if(err) {
			console.log(err);
		}else {
			var k = JSON.stringify(result, null, 2);
			var l = JSON.parse(k);
			
			//if(){
				//console.log("Bad :( "))
			//}else {
				// This gets returned as "" rather than "0" for some reason.
				var precip = l[0].forecast[1].precip;
				if(precip === ""){
					precip = "0";
				}
					
				botResponse = "The forecast for: " + l[0].forecast[1].day + ", " + l[0].forecast[1].date + " in " + l[0].current.observationpoint + " is ";
				postMessage(botResponse);	
					
				botResponse = "High/Low: " + l[0].forecast[1].high + "°F/" + l[0].forecast[1].low + "°F, " + l[0].forecast[1].skytextday + " with a " + precip + " chance of precipatation";
				postMessage(botResponse);
			//}

		}
	}); */
}

function gif_command(keyword){
	giphy.search(keyword, function(err, info) {
		var k =  Object.keys(info.data).length;
		var t = randomIntFromInterval(0, k-1);
		postImage("", info.data[t].embed_url);
	});
}

function postMessage(message) {
    var botResponse, options, body, botReq;

	options = {
		hostname: 'api.groupme.com',
		path: '/v3/bots/post',
		method: 'POST'
	};

	body = {
		"bot_id" : botID,
		"text" : message
	};

	console.log('sending ' + message + ' to ' + botID);

	botReq = HTTPS.request(options, function(res) {
		if(res.statusCode == 202) {
		//neat
		} else {
			console.log('rejecting bad status code ' + res.statusCode);
		}
	});

	botReq.on('error', function(err) {
		console.log('error posting message '  + JSON.stringify(err));
	});
	
	botReq.on('timeout', function(err) {
		console.log('timeout posting message '  + JSON.stringify(err));
	});
	
	botReq.end(JSON.stringify(body));
}

function postImage(message, imageURL){
	var botResponse, options, body, botReq;

	options = {
		hostname: 'api.groupme.com',
		path: '/v3/bots/post',
		method: 'POST'
	};

	body = {
		"bot_id" : botID,
		"text" : message,
		"attachments" : [
			{
				"type"  : "image",
				"url"   : imageURL,
			}
		]
	};

	console.log('sending image w/ message ' + message + ' to ' + botID);

	botReq = HTTPS.request(options, function(res) {
		if(res.statusCode == 202) {
		//neat
		} else {
			console.log('rejecting bad status code ' + res.statusCode);
		}
	});

	botReq.on('error', function(err) {
		console.log('error posting message '  + JSON.stringify(err));
	});
	
	botReq.on('timeout', function(err) {
		console.log('timeout posting message '  + JSON.stringify(err));
	});
	
	botReq.end(JSON.stringify(body));
}

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

exports.respond = respond;