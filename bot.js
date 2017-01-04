var HTTPS = require('https');

var weather = require('weather');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.string(this.req.chunks[0]),
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

  botResponse = "Weather command enabled";
  
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