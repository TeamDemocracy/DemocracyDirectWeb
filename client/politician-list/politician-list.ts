/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts-ui.d.ts" />
import {Component, View} from 'angular2/core';

import {NgFor} from 'angular2/common';
import {RouterLink} from 'angular2/router';
import {AccountsUI} from 'meteor-accounts-ui';

import {MeteorComponent} from 'angular2-meteor';

import {Comments} from 'collections/all';

import {PartiesForm} from 'client/parties-form/parties-form';

@Component({
	selector: 'app'
})
@View({
	templateUrl: 'client/politician-list/politician-list.html',
	directives: [NgFor, PartiesForm,RouterLink,AccountsUI]
})
export class PoliticianList extends MeteorComponent {
	parties: Mongo.Cursor<Object>;

	constructor() {
		super();
		this.subscribe('Comment', () => {
			this.autorun(() => {
				this.parties = Comments.find({},{sort:{createdAt:-1}});
				console.log(this.parties);
			},   true);
		}, true);
	}
	removeComment(comment){
		try {
			Meteor.call('removeComment',comment._id);
		}
		catch (err) {
			console.log(err);
		}

	}
}
