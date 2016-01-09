/// <reference path="../typings/angular2-meteor.d.ts" />
declare var Astro;
export var Politicians = new Mongo.Collection('politicians');



export var Politician = Astro.Class({
    name: 'Politician',
    collection: Politicians,
    fields: {
        firstname: 'string',
        lastname: 'string',
        dob: 'date'
    },
    behaviors: ['timestamp']
});
