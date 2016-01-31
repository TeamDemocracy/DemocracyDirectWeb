/// <reference path="../../typings/meteor/meteor.d.ts" />

import {ICountry} from './country';
import {BillSynchronizer} from './sweden/bill-synchronizer';


class Sweden implements ICountry {

	//The name of the country
	name: string = 'sweden';

	//The url base to use when constructing the dokuentstatus url
	documentStatusUrlBase: string = 'http://data.riksdagen.se/dokumentstatus/'; // + docID.json (H101SfU3 for example)

	//The url base for debatevideo
	debateStreamUrlBase: string = 'http://www.riksdagen.se/Templates/Pages/embedwebtv.aspx?did='; // + docID (H310251 for example)

	private _billSynchronizer;

	constructor() {
		this._billSynchronizer = new BillSynchronizer();
	}

	indexBills(): void {

		this._billSynchronizer.index();
	}

	synchronizeBills(): void {

		this._billSynchronizer.synchronize();
	}
}

export var sweden: Sweden = new Sweden();
