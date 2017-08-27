
'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = "Dish Honesty";  // TODO replace with your app ID (OPTIONAL).

const handlers = {
    'LaunchRequest': function () {
        if (!this.attributes['status']) {
            this.emit(':ask', "Sorry no one has told me if the dishes are clean or dirty yet. If you know say 'The dishes are clean' or 'The dishes are dirty");
        } else 
            this.emit('CheckDishwasher');
    },
    'CheckDishwasher': function () {
        var status = this.attributes['status'];
        var statusMessage;
        if (status == "clean")
            statusMessage = "The dishes are clean.";
        else 
            statusMessage = "The dishes are dirty.";
        this.emit(':tell', statusMessage);
    },
    'UpdateDishwasher': function () {
        this.attributes['status'] = this.event.request.intent.slots.status.value;
        var updateMessage = "Ok, I'll remember the dishes are " + this.attributes['status'];
        this.emit(':tell', updateMessage);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // alexa.dynamoDBTableName = 'dishStatus'
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();
};
