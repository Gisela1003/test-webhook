var request = require("request")
var point = 0;
var point2 = 0;

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

    // if (event.session.application.applicationId !== "") {
    //     context.fail("Invalid Application ID");
    //  }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback)
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == "GetTotalInfoIntent") {
       handleGetInfoTotalIntent(intent, session, callback)
    }else if(intentName == "GetAnioInfoIntent"){
               handleGetAnioInfoIntent(intent, session, callback)

    }else if(intentName == "GetStateInfoIntent"){
               handleGetStateInfoIntent(intent, session, callback)

    }
    else if(intentName == "GetStateAnioInfoIntent"){
               handleGetStateAnioInfoIntent(intent, session, callback)

    }else if(intentName == "AMAZON.NoIntent"){
        handleNoResponse(intent,session,callback);
      }
      else if(intentName == "EndSessionIntent"){
        handleNoResponse(intent,session,callback);
      }
    else {
         throw "Invalid intent"
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    var speechOutput = "Welcome! This is Life ray Sales Cars App, I can help you, tell me, what do you need?"
    

    var reprompt = "Tell me please what do you need to know please"

    var header = "Get Info"

    var shouldEndSession = false

    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    }

    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))

}

function  handleGetStateAnioInfoIntent(intent, session, callback) {
   var speechOutput = "We have an error"
   point = intent.slots.State.value.toString();
   point2 = intent.slots.Anio.value.toString();

    getJSONAnioState(function(data) {
       if (data != "ERROR") {
           var a = Number(data);
           data = data.replace('/"','');

            var speechOutput = "The total of sales cars for "+ point +" in "+point2+ " is " + data + " cars";
            
        }
        callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput,"", false))
    })
}

function  handleNoResponse(intent, session, callback){
    handleFinishSessionRequest(intent,session,callback);
  }
  
  function handleFinishSessionRequest(intent, session, callback) {
      // End the session with a "Good bye!" if the user wants to quit the game
      callback(session.attributes,
          buildSpeechletResponseWithoutCard("Good bye! Thank you for using Life ray Sales Query Alexa App!", "", true));
  }
  
function  handleGetStateInfoIntent(intent, session, callback) {
   var speechOutput = "We have an error"
   point = intent.slots.State.value.toString();

    getJSONState(function(data) {
       if (data != "ERROR") {
           var a = Number(data);
           data = data.replace('/"','');

            var speechOutput = "The total of sales cars in "+ point +"  from 2014 to 2016 is " + data + " cars";
            
        }
        callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput,"", false))
    })
}

function handleGetInfoTotalIntent(intent, session, callback) {
   var speechOutput = "We have an error"
  //  point = intent.slots.Value.value.toString();

    getJSON(function(data) {
       if (data != "ERROR") {
           var a = Number(data);
           data = data.replace('/"','');

            var speechOutput = "The total of sales cars in Mexico from 2014 to 2016 is " + data + " cars";
            
        }
        callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput,"", false))
    })
}

function handleGetAnioInfoIntent(intent, session, callback) {
   var speechOutput = "We have an error"
    point = intent.slots.Anio.value.toString();

    getJSONAnio(function(data) {
       if (data != "ERROR") {
           var a = Number(data);
           data = data.replace('/"','');

            var speechOutput = "The total of sales cars in Mexico "+ point+" is " + data + " cars";
            
        }
        callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput,"", false))
    })
}

function urlAnioState() {
   // return "http://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=Harry+Potter"
  // return "http://test@liferay.com:test@192.168.15.58:8080/api/jsonws/alexaskill.entry/get-total-global"
  //return "http://104.197.31.127:9080/api/jsonws/alexaskill.entry/get-total-global"
   return "http://sergio@4dmin@www.consistent.com.mx/api/jsonws/alexaskill.entry/get-total-by-anio-and-state-global/anio/" + point2.toString()
   +"/state/"+ point.toString();
}

function urlState() {
   // return "http://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=Harry+Potter"
  // return "http://test@liferay.com:test@192.168.15.58:8080/api/jsonws/alexaskill.entry/get-total-global"
  //return "http://104.197.31.127:9080/api/jsonws/alexaskill.entry/get-total-global"
  
   return "http://sergio@4dmin@www.consistent.com.mx/api/jsonws/alexaskill.entry/get-total-by-state-global/state/" + point.toString();
}

function urlAnio() {
   // return "http://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=Harry+Potter"
  // return "http://test@liferay.com:test@192.168.15.58:8080/api/jsonws/alexaskill.entry/get-total-global"
  //return "http://104.197.31.127:9080/api/jsonws/alexaskill.entry/get-total-global"
   return "http://sergio@4dmin@www.consistent.com.mx/api/jsonws/alexaskill.entry/get-total-by-anio-global/anio/" + point.toString();
}


function url() {
   // return "http://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=Harry+Potter"
  // return "http://test@liferay.com:test@192.168.15.58:8080/api/jsonws/alexaskill.entry/get-total-global"
  return "https://sergio@4dmin@www.consistent.com.mx/api/jsonws/alexaskill.entry/get-total-global"
   //return "http://sergio:4dmin@pocs.consistent.mx:9080/api/jsonws/foo.grados/get-fahrenheit/r/" + point.toString();
}

function handleYesResponse(intent,session,callback){

    var speechOutput = "Great! Tell me what do you need?";
    var repromptText = speechOutput;
    var shouldEndSession = false;
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
  }

function handleFinishSessionRequest(intent, session, callback) {
      // End the session with a "Good bye!" if the user wants to quit the game
      callback(session.attributes,
          buildSpeechletResponseWithoutCard("Good bye! Thank you for using Liferay Cars App!", "", true));
  }

  function  handleNoResponse(intent, session, callback){
      handleFinishSessionRequest(intent,session,callback);
    }
    
    function getJSONAnioState(callback,value) {
    // HTTP - WIKPEDIA
     request.get(urlAnioState(), function(error, response, body) {
       // var d = JSON.parse(body)
       //var result = d.query.searchinfo.totalhits
        if (response.statusCode=="200") {
           callback(body);
        } else {
            callback("ERROR")
            console.log(response.statusCode);
        }
     })
}
    
    function getJSONState(callback,value) {
    // HTTP - WIKPEDIA
     request.get(urlState(), function(error, response, body) {
       // var d = JSON.parse(body)
       //var result = d.query.searchinfo.totalhits
        if (response.statusCode=="200") {
           callback(body);
        } else {
            callback("ERROR")
            console.log(response.statusCode);
        }
     })
}
    
    function getJSONAnio(callback,value) {
    // HTTP - WIKPEDIA
     request.get(urlAnio(), function(error, response, body) {
       // var d = JSON.parse(body)
       //var result = d.query.searchinfo.totalhits
        if (response.statusCode=="200") {
           callback(body);
        } else {
            callback("ERROR")
            console.log(response.statusCode);
        }
     })
}

function getJSON(callback,value) {
    // HTTP - WIKPEDIA
     request.get(url(), function(error, response, body) {
       // var d = JSON.parse(body)
       //var result = d.query.searchinfo.totalhits
        if (response.statusCode=="200") {
           callback(body);
        } else {
            callback("ERROR")
            console.log(response.statusCode);
        }
     })
}



// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

function capitalizeFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}
