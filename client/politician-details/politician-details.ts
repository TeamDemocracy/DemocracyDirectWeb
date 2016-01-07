/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {Politicians} from 'collections/politicians';

@Component({
  selector: 'politician-details'
})
@View({
  templateUrl: '/client/politician-details/politician-details.html'
})
export class PoliticianDetails {
  party: Object;

    constructor(params: RouteParams) {
        var partyId = params.get('politicianId');
        this.party = Politicians.findOne(partyId);
    }
}
