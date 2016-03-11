DocumentStatus = (function() {
	/*jshint validthis: true */
	'user strict';

	var BASE_URL = 'http://data.riksdagen.se/dokumentstatus/';
	var DOCUMENT_STATUS_KEY = 'dokumentstatus';

	function DocumentStatus(id) {
		this.id = id;
		this._data = this._query();
	}

	DocumentStatus.prototype = {
		synchronizeVotings: synchronizeVotings,
		_query: _query,
	};

	return DocumentStatus;

	////////////////

	function synchronizeVotings() {
		if (!(this._data.hasOwnProperty('dokutskottsforslag') &&
		      this._data['dokutskottsforslag'].hasOwnProperty('utskottsforslag'))) {
			return;
		}
		var votingsRAW = this._data['dokutskottsforslag']['utskottsforslag'];
		if (!Array.isArray(votingsRAW) || votingsRAW.length < 1) {
			return;
		}
		
		var votings = votingsRAW.map(function(raw, i) {
			// See this document for additional mappings:
			// http://data.riksdagen.se/dokumentstatus/H101MJU2.json
			var voting = {
				title: raw['rubrik'],
				proposal: raw['forslag'],
				id: raw['votering_id'],
			};

			if (raw['votering_sammanfattning_html'] !== null) {
				var rows = raw['votering_sammanfattning_html']['table']['tr'];
				var row = rows.find(function(row) {
					return row.hasOwnProperty('td') && row['td'][0] === "Totalt";
				}, this);
				if (row !== undefined) {
					var total = row['td']
					voting.result = {
						yes: parseInt(total[1]),
						no: parseInt(total[2]),
						refrain: parseInt(total[3]),
						absent: parseInt(total[4])
					};
				}
			}

			return voting;
		}, this);

		Bills.update({ _id: this.id }, { $set: { votings: votings } });
	}

	function _query() {
		var result = HTTP.get(BASE_URL + this.id + '.json');
		return result.data[DOCUMENT_STATUS_KEY];
	}
})();
