DocumentStatus = (function() {
	/*jshint validthis: true */
	'user strict';

	var BASE_URL = 'http://data.riksdagen.se/dokumentstatus/';
	var DOCUMENT_STATUS_KEY = 'dokumentstatus';

	var CATEGORIES = {
		"AU": "Arbetsmarknad",
		// TODO: Fix this name:
		"CU": "Civil",
		"FiU": "Finans",
		"F&#246;U": "Försvar",
		"JuU": "Lag och ordning",
		"KU": "Konstitution",
		"KrU": "Kultur",
		"MJU": "Miljö- och jordbruk",
		"NU": "Näringsliv",
		"SkU": "Skatt",
		"SfU": "Socialförsäkring",
		"SoU": "Social",
		"TU": "Trafik",
		"UbU": "Utbildning",
		"UU": "Utrikes",
		"JuSoU": "JuSoU",
		"KUU": "KUU",
		"UF&#246;U": "UFöU",
		"UMJU": "UMJU",
		"USoU": "USoU",
		"JoU": "Miljö- och jordbruk", // -1997/98
		"BoU": "Bostad", // -2005/06
		"LU": "Lag och ordning", // -2005/06
		"EUN": "EU",
	};

	function DocumentStatus(id) {
		this.id = id;
		this._data = this._query();
	}

	DocumentStatus.prototype = {
		synchronizeVotings: synchronizeVotings,
		_query: _query,
		_getNestedProperty: _getNestedProperty,
		_getList: _getList,
		_getActivities: _getActivities,
		_getInfo: _getInfo,
		_getVotings: _getVotings,
		_getVotingResult: _getVotingResult,
	};

	return DocumentStatus;

	////////////////

	function synchronizeVotings() {

		var activities = this._getActivities();
		var isReady = activities.some(function(activity, i) {
			return activity['kod'] === 'BES';
		});
		if (!isReady) return;

		var info = this._getInfo();

		var titleObj = info.find((obj) => { return 'notisrubrik' === obj['kod']; });
		if (!titleObj) return;
		var title = titleObj['text'];

		var summaryObj = info.find((obj) => { return 'notis' === obj['kod']; });
		if (!titleObj) return;
		var summary = summaryObj['text'];

		var categoryKey = this._getNestedProperty(this._data, ['dokument', 'organ']);
		if (!categoryKey) return;
		if (!CATEGORIES.hasOwnProperty(categoryKey)) {
			console.warn('Category key', categoryKey, 'has no translation');
		}
		var category = CATEGORIES[categoryKey] || categoryKey;

		var votings = this._getVotings();

		var mappedVotings = votings.map(function(voting, i) {
			// See this document for additional mappings:
			// http://data.riksdagen.se/dokumentstatus/H101MJU2.json
			return {
				title: voting['rubrik'],
				proposal: voting['forslag'],
				id: voting['votering_id'],
				result: this._getVotingResult(voting),
			};
		}, this);

		var billUpdate = {
			title: title,
			summary: summary,
			votings: mappedVotings,
			category: category,
			isReady: true,
		};

		Bills.update({ _id: this.id }, { $set: billUpdate });
	}

	////////////////

	function _query() {
		var result = HTTP.get(BASE_URL + this.id + '.json');
		return result.data[DOCUMENT_STATUS_KEY];
	}

	function _getNestedProperty(layer, keys) {
		for (var i in keys) {
			if (typeof layer !== 'object' || layer === null) {
				return undefined;
			}
			var key = keys[i];
			layer = layer[key];
		}
		return layer;
	}

	function _getList(layer, keys) {
		var obj = this._getNestedProperty(layer, keys);
		if (undefined === obj) {
			return [];
		}
		if (Array.isArray(obj)) {
			return obj;
		}
		return [obj];
	}

	function _getActivities() {
		return this._getList(this._data, ['dokaktivitet', 'aktivitet']);
	}

	function _getInfo() {
		return this._getList(this._data, ['dokuppgift', 'uppgift']);
	}

	function _getVotings() {
		return this._getList(this._data, ['dokutskottsforslag', 'utskottsforslag']);
	}

	function _getVotingResult(voting) {
		var rows = this._getList(voting, ['votering_sammanfattning_html', 'table', 'tr']);
		var row = rows.find(function(row) {
			var data = row['td'];
			return data && data[0] === "Totalt";
		});
		if (row) {
			var total = row['td'];
			return {
				yes: parseInt(total[1]),
				no: parseInt(total[2]),
				refrain: parseInt(total[3]),
				absent: parseInt(total[4]),
			};
		}
	}

})();
