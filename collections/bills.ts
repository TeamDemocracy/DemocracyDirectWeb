/// <reference path="../typings/angular2-meteor.d.ts" />
import {Comments} from './comments';

export var Bills = new Mongo.Collection('bills');

declare var Astro;
export var Bill = Astro.Class({
	name: 'Bill',
	collection: Bills,
	fields: {
		_id: 'string',
		title: 'string',
		index: { 
			type: 'number',
			index: -1,
		}
	},
	relations: {
		comments: {
			type: 'many',
			class: 'Comments',
			local: '_id',
			foreign: 'billId'
		}
	},
	behaviors: ['timestamp']
});

// var bill = new Bill();
// bill.save();
