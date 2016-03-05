DocumentList = (function() {
	/*jshint validthis:true */
	'use strict';

	var BASE_URL = 'http://data.riksdagen.se/dokumentlista/';
	var MAX_HITS_PER_PAGE = 200;
	var HITS_PER_PAGE = 200;
	var DOCUMENT_LIST_KEY = 'dokumentlista'; // How to get the document list
	var COUNT_KEY = '@traffar'; // How to get the number of hits from a document list
	var PAGE_COUNT_KEY = '@sidor';
	var DOCUMENT_KEY = 'dokument'; // How to get the document(s)
	var DOCUMENT_DATE_KEY = 'datum'; // How to get the date of a document

	function DocumentList(type, fromDate, toDate) {
		this.type = type;

		var dateMin = this._getDateMin();
		var dateMax = this._getDateMax();
		this.fromDate =  (fromDate  && fromDate > dateMin)  ? fromDate  : dateMin;
		this.toDate =    (toDate    &&   toDate < dateMax)  ? toDate    : dateMax;

		this.data = this._query(1, 0);
	}

	DocumentList.prototype = {
		count: count,
		forEach: forEach,
		_query: _query,
		_pageCount: _pageCount,
		_getDateMin: _getDateMin,
		_getDateMax: _getDateMax,
		_getDateExtreme: _getDateExtreme,
	};

	return DocumentList;

	////////////////

	function count() {
		return parseInt(this.data[COUNT_KEY]);
	}

	function forEach(callback, thisArg) {

		var counter = 0;

		for (var year = this.fromDate.getFullYear(); year <= this.toDate.getFullYear(); year++) {

			// One year at a time to get around the bug with more than 10000 results in Riksdagens api

			var dateMin = new Date(year, 0, 1); // First millisecond of current year
			var dateMax = new Date(+new Date(year + 1, 0, 1) - 1); // Last millisecond of current year
			var fromDate =  (this.fromDate > dateMin)  ? this.fromDate  : dateMin;
			var toDate =    (this.toDate < dateMax)    ? this.toDate    : dateMax;

			var partial = new DocumentList(this.type, fromDate, toDate);

			for (var page = 1; page <= partial._pageCount(); page++) {

				var data = partial._query(page, HITS_PER_PAGE, 'asc');
				var documents = data[DOCUMENT_KEY];

				if (!Array.isArray(documents)) {
					// If the page contains only one document
					documents = [documents];
				}

				for (var i in documents) {

					callback.call(thisArg, documents[i], counter++);
				}
			}
		}
	}

	/**
	 * Query bills from Riksdagens api
	 * @param  {number} page
	 * @param  {number} hitsPerPage
	 * @param  {string} [order] - "asc" or "desc"
	 * @return {object} example http://data.riksdagen.se/dokumentlista/?avd=dokument&doktyp=bet&a=s&sortorder=desc&sort=datum&utformat=json&sz=50&p=20
	 */
	function _query(page, hitsPerPage, order) {

		console.assert(hitsPerPage <= MAX_HITS_PER_PAGE);

		order = order || 'asc';

		var params = {
			"p": page,
			"avd": "dokument",
			"doktyp": this.type,
			"a": "s",
			"sortorder": order,
			"sort": "datum",
			"utformat": "json",
			"sz": hitsPerPage,
			"from": makeDateString(this.fromDate),
			"tom": makeDateString(this.toDate),
		};

		var result = HTTP.get(BASE_URL, { params: params });

		return result.data[DOCUMENT_LIST_KEY];

		function makeDateString(date) {
			if (!(date instanceof Date)) return undefined;
			var year = date.getFullYear().toString();
			var month = ('0' + (date.getMonth() + 1).toString()).substr(-2);
			var day = ('0' + date.getDate().toString()).substr(-2);
			return [year, month, day].join('-');
		}
	}

	function _pageCount() {
		return Math.ceil(this.count() / HITS_PER_PAGE);
	}

	function _getDateMin() {
		return this._getDateExtreme("asc");
	}

	function _getDateMax() {
		return this._getDateExtreme("desc");
	}

	function _getDateExtreme(order) {
		var data = this._query(1, 1, order);
		var document = data[DOCUMENT_KEY];
		var date = new Date(document[DOCUMENT_DATE_KEY]);
		return date;
	}

})();
