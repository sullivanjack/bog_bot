var HTTPS = require('https');

var weather = require('weather-js');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
  botRegex = /^\/stan weather/;
 
  if(request.text && botRegex.test(request.text)) {
	console.log("This is good.");
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage() {
  var botResponse, options, body, botReq;

  console.log("This is very good.");
 // weather({location: 'dallas'}, function(data) {
	//	botResponse = data.temp;
  //});

	var botResponse;

	// Options:
	// search:     location name or zipcode
	// degreeType: F or C

	weather.find({search: 'New York', degreeType: 'F'}, function(err, result) {
		if(err) console.log(err);
		var k = JSON.stringify(result, null, 2);
		var l = JSON.parse(k);
		botResponse = "'The forecast for: " + l[0].forecast[0].day + ", " + l[0].forecast[0].date + " is /n/n High/Low: "
			+ l[0].forecast[0].high + "°F/" + l[0].forecast[0].low + "°F, " + l[0].forecast[0].skytextday + " with a " 
			+ l[0].forecast[0].precip + " chance of precipatation'";
	});
	
		console.log(botResponse);
  
	  options = {
		hostname: 'api.groupme.com',
		path: '/v3/bots/post',
		method: 'POST'
	  };

	  body = {
		"bot_id" : botID,
		"text" : botResponse
	  };

	  console.log('sending ' + botResponse + ' to ' + botID);

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