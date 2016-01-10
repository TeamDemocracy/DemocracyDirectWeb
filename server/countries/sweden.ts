/// <reference path="../../typings/meteor/meteor.d.ts" />

import {ICountry} from './country';
import {Bill, Bills} from 'collections/bills';

class Sweden implements ICountry {

	//The name of the country
	name:string = 'sweden';

	//The url from which one would collect the simple description of a descision
	documentListUrlBase:string = 'http://data.riksdagen.se/dokumentlista/';

	//The url base to use when constructing the dokuentstatus url
	documentStatusUrlBase:string = 'http://data.riksdagen.se/dokumentstatus/'; // + docID.json (H101SfU3 for example)

	//The url base for debatevideo
	debateStreamUrlBase:string = 'http://www.riksdagen.se/Templates/Pages/embedwebtv.aspx?did='; // + docID (H310251 for example)



	//MARK: PARSER FUNCTIONS
	// Functions that interperates input data and morphs, validates and formats a desired output

	getBillDocuments(page:number, nHitsPerPage:number):any {
		if (nHitsPerPage > 200) {
			throw "nHitsPerPage cannot be greater than 200";
		}

		var result = HTTP.get(this.documentListUrlBase, {
			params: {
				"p": page,
				"avd": "dokument",
				"doktyp": "bet",
				"Facets": "2",
				"a": "s",
				"sortorder": "desc",
				"sort": "datum",
				"utformat": "json",
				"sz": nHitsPerPage
			}
		});
		// Exapmle data: http://data.riksdagen.se/dokumentlista/?avd=dokument&doktyp=bet&a=s&sortorder=desc&sort=datum&utformat=json&sz=50&p=20
		return result.data.dokumentlista;
	}

	getDocumentStatus(id:string):any {
		var documentStatusUrl = this.documentStatusUrlBase + id + '.json';
		var result = HTTP.get(documentStatusUrl)
		// Example data: http://data.riksdagen.se/dokumentstatus/H101SfU3.json
		return result.data.dokumentstatus;
	}



	//MARK: FLOW FUNCTIONS
	// functions that pass data around to different parsing or fetching functions.

	/*
	This function will attempt to update
	all the descisions that the system does not have already.
	*/
	synchronizeBills():void {

		// 1   [x] Get the first set of reports
		// 2   [ ] For each report:
		// 2.1 [ ]     If report id already in database or no more reports: DONE!
		// 2.2 [x]     Get docstatus for report and gather data that is needed.
		// 2.3 [ ]     Create the bill object that will be saved to mongo.
		// 2.4 [ ]     Save the new report.
		// 3   [x] Get the next set of reports.
		// 4   [ ] If total number of reports has been increased: skip as many documents as the increment.
		// 5   [x] Repeat step 2.


		console.log('Synchronization process for bills started...');

		var nTotalHits = 300;
		var iCurrentHit = 1;
		var iCurrentPage = 1;
		var nHitsPerPage = 200;

		var begin = (new Date()).getTime();
		var lastStatus = 0;

		while (iCurrentHit <= nTotalHits) {

			try {
				var documentList = this.getBillDocuments(iCurrentPage, nHitsPerPage);

				// TODO: Hande if new documents are prepended during syncronization

				var documents = documentList.dokument;

				for (var doc of documents) {

					if (iCurrentHit > nTotalHits) break;

					var id = doc.id;
					var bill = {
						title: undefined,
						summary: undefined,
						result: undefined
					};

					try {
						var documentStatus = this.getDocumentStatus(id);
						var info = documentStatus.dokuppgift.uppgift;

						bill.title = info.find((c) => { return c.kod === 'notisrubrik' }).text;
						bill.summary = info.find((c) => { return c.kod === 'notis' }).text;
						bill.result = info.find((c) => { return c.kod === 'rdbeslut' }).text;
					}
					catch (error) {
						// TODO: What happens if dokument has not yet been published?
					}

					var now = (new Date()).getTime();

					if (now - lastStatus >= 1000) {
						var progress = Math.floor(10000 * iCurrentHit / nTotalHits) / 100;
						var elapsed = now - begin;

						console.log(iCurrentHit + ' / ' + nTotalHits +  '\t' + progress + '%\t' + millisecondsToString(elapsed));
						lastStatus = now;
					}

					iCurrentHit++;

				}
			}
			catch (error) {
				console.error('Synchronization process for bills failed: ' + error);
				return;
			}

			iCurrentPage++;

		}

		var now = (new Date()).getTime();
		var elapsed = now - begin;

		console.log('Synchronization process for bills succeeded:')
		console.log('Synchronized ' + nTotalHits + ' bills in ' + millisecondsToString(elapsed));

		function millisecondsToString(milliseconds:number):string {
			var hours = Math.floor(milliseconds / 1000 / 60 / 60);
			var minutes = Math.floor(milliseconds / 1000 / 60) - hours * 60;
			var seconds = Math.floor(milliseconds / 1000) - (hours * 60 + minutes) * 60;
			return hours + 'h ' + minutes + 'm ' + seconds + 's';
		}

	}
}

export var sweden: Sweden = new Sweden();
