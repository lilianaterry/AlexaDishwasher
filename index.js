
'use strict';

var Alexa = require('alexa-sdk');
//var AWS = require('aws-sdk');

const APP_ID = "amzn1.ask.skill.8685aeee-1cf7-442d-b97b-d9dbe16a8173";  // TODO replace with your app ID (OPTIONAL).
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const handlers = {
    'LaunchRequest': function () {
        if (!this.attributes['status']) {
            this.emit(':ask', "Sorry no one has told me if the dishes are clean" + 
                        "or dirty yet. If you know say 'The dishes are clean' or" + 
                        "'The dishes are dirty'");
        } else 
            this.emit('CheckDishwasher');
    },
    'CheckDishwasher': function () {
        var status = this.attributes['status'];
        var statusMessage = "The dishes are " + status;
        var reprompt = "If you just did the dishes, let me know by saying 'Clean' or 'Dirty'";
        this.emit(':ask', statusMessage);
    },
    'UpdateDishwasher': function () {
        // This gets the slot value the user provided when they said "The dishes are ___"
        this.attributes['status'] = this.event.request.intent.slots.status.value;
        var status = this.attributes['status']
        var updateMessage = "Ok, I'll remember the dishes are " + status;
        
        // this.emit(':saveState', true);
        this.emit(':tell', updateMessage);
    },
    'AMAZON.HelpIntent': function () {
        var help = "To use this skill, you can ask 'Are the dishes dirty?'" + 
                            "or say 'The dishes are clean.'. If you don't want" +
                            "to check the dishes you can say 'Stop'";              
        this.emit(':ask', help);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        var stop = "Ok, goodbye!";
        this.emit(':tell', stop);
    },
};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.dynamoDBTableName = 'dishwasherStatus';    
    alexa.execute();
};
