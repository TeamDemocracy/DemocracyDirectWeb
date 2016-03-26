DocumentStatus = function(id) {
	'use strict';

	const BASE_URL = 'http://data.riksdagen.se/dokumentstatus/';
	const DOCUMENT_STATUS_KEY = 'dokumentstatus';
	const TYPES = {
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

	let data = query();

	this.isReady = isReady;
	this.getTitle = getTitle;
	this.getSummary = getSummary;
	this.getType = getType;
	this.getProposals = getProposals;

	////////////////

	/**
	 * Check if the document status is ready to be used.
	 * ALWAYS check this before doing anything else.
	 * @return {Boolean}
	 */
	function isReady() {
		if (!data) return false;
		let activities = getActivities();
		return activities.some((x) => {
			return x['kod'] === 'BES';
		});
	}

	function getTitle() {
		let info = getInfo();
		let found = info.find((x) => {
			return x['kod'] === 'notisrubrik';
		});
		return (typeof found === 'object') ? found['text'] : undefined;
	}

	function getSummary() {
		let info = getInfo();
		let found = info.find((x) => {
			return x['kod'] === 'notis';
		});
		return (typeof found === 'object') ? found['text'] : undefined;
	}

	function getType() {
		let key = data.extract('dokument.organ');
		if (!key) return undefined;
		if (!TYPES.hasOwnProperty(key)) {
			console.warn('Type key', key, 'has no translation');
		}
		return TYPES[key] || key;
	}

	function getProposals() {
		let proposals = data.extractList('dokutskottsforslag.utskottsforslag');
		let mapped = proposals.map((proposal) => {
			// See this document for additional mappings:
			// http://data.riksdagen.se/dokumentstatus/H101MJU2.json
			return {
				title: proposal['rubrik'],
				proposal: proposal['forslag'],
				id: proposal['votering_id'],
				result: getVotingResult(proposal),
			};
		});
		return mapped;
	}

	function query() {
		let data;
		try {
			let result = HTTP.get(BASE_URL + id + '.json');
			data = result.data['dokumentstatus'];
		}
		catch(e) {
			return undefined;
		}
		let extractor = new DataExtractor(data);
		return extractor;
	}

	function getActivities() {
		return data.extractList('dokaktivitet.aktivitet');
	}

	function getInfo() {
		return data.extractList('dokuppgift.uppgift');
	}

	function getVotingResult(voting) {
		voting = new DataExtractor(voting);
		let rows = voting.extractList('votering_sammanfattning_html.table.tr');
		let rowTotal = rows.find((row) => {
			let data = row['td'];
			return data && data[0] === "Totalt";
		});
		if (rowTotal) {
			let total = rowTotal['td'];
			let result = {
				yes: parseInt(total[1]),
				no: parseInt(total[2]),
				refrain: parseInt(total[3]),
				absent: parseInt(total[4]),
			};
			return result;
		}
		else {
			return undefined;
		}
	}
};
