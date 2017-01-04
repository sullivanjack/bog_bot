var HTTPS = require('https');

var weather = require('weather-js');

var botID = process.env.BOT_ID;

function respond() {
	var request = JSON.parse(this.req.chunks[0]),

	// Commands Here:
	weatherRegex = /^\/stan weather/;

	if(request.text && weatherRegex.test(request.text)) {
		this.res.writeHead(200);
		
		var location = request.text.substring(14, request.text.length);
		weather_command(location);

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

	weather.find({search: loc, degreeType: 'F'}, function(err, result) {
		if(err) console.log(err);
		var k = JSON.stringify(result, null, 2);
		var l = JSON.parse(k);
		
		// This gets returned as "" rather than "0" for some reason.
 		var precip = l[0].forecast[0].precip;
		if(precip === ""){
			precip = "0";
		}
			
		botResponse = "High/Low: " + l[0].forecast[0].high + "°F/" + l[0].forecast[0].low + "°F, " + l[0].forecast[0].skytextday + " with a " + precip + " chance of precipatation";
		postMessage(botResponse);
		
		botResponse = "The forecast for: " + l[0].forecast[0].day + ", " + l[0].forecast[0].date + " in " + loc + " is ";
		postMessage(botResponse);
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


exports.respond = respond;