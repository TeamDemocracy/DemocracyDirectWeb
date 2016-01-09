
//custom meteor angular2 boostrap function
import {bootstrap} from 'angular2-meteor';
//built in angular 2 components
import {Component, View, NgZone, provide} from 'angular2/core';
import {NgFor} from 'angular2/common';

import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, APP_BASE_HREF} from 'angular2/router';

import {PoliticianList} from 'client/politician-list/politician-list';

import {PoliticianDetails} from 'client/politician-details/politician-details';


@Component({
	selector: 'app'
})
@View({
	template: '<router-outlet></router-outlet>',
	directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
	{ path: '/', as: 'PoliticianList', component: PoliticianList },
	{ path: '/PoliticianDetails/:politicianId', as: 'PoliticianDetails', component: PoliticianDetails }
])

class democracyDirect { }

bootstrap(democracyDirect,[ROUTER_PROVIDERS,provide(APP_BASE_HREF, { useValue: '/' })]);
