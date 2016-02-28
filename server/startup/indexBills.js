Meteor.startup(function() {

	var BASE_URL = 'http://data.riksdagen.se/dokumentlista/';
	var HITS_PER_PAGE = 200;
	var DOCUMENT_LIST_KEY = 'dokumentlista'; // How to get the document list
	var COUNT_KEY = '@traffar'; // How to get the number of hits from a document list
	var DOCUMENT_KEY = 'dokument'; // How to get the document(s)
	var DOCUMENT_DATE_KEY = 'datum'; // How to get the date of a document
	var DOCUMENT_ID_KEY = 'id'; // How to get the id of a document
	var DOCUMENT_TITLE_KEY = 'notisrubrik'; // How to get the title of a document
	var DOCUMENT_SUMMARY_KEY = 'notis'; // How to get the summary of a document

	var nextIndex = 0;
	var progress = new Progress();

	if (Bills.find().count() > 0) {
		Bills._dropCollection();
	}

	index();

	////////////////

	function index() {
		yearBegin = 2014;//getYearBegin();
		yearEnd = 2014;//getYearEnd();

		dbBillCount = getBillCount(yearBegin, yearEnd);
		progress.reset(dbBillCount);

		console.log("Indexing of", dbBillCount, "bills between", yearBegin, "and", yearEnd, "will now begin...");

		for (var year = yearBegin; year <= yearEnd; year++) {

			indexYear(year);

		}
	}

	function indexYear(year) {
		var billCount = getBillCount(year, year);
		var numberOfPages = Math.ceil(billCount / HITS_PER_PAGE);

		for (var page = 1; page <= numberOfPages; page++) {

			var data = queryBills(page, HITS_PER_PAGE, year, year, 'asc');
			var documents = data[DOCUMENT_KEY];
			indexDocuments(documents);
			progress.tick(nextIndex);

		}
	}

	function indexDocuments(documents) {
		for (var doc of documents) {

			var bill = {
				_id: doc[DOCUMENT_ID_KEY],
				index: nextIndex++,
				title: doc[DOCUMENT_TITLE_KEY],
				summary: doc[DOCUMENT_SUMMARY_KEY]
			};

			Bills.insert(bill);

		}
	}

	/**
	 * Query bills from Riksdagens api
	 * @param  {number} page
	 * @param  {number} hitsPerPage
	 * @param  {number} [fromYear]
	 * @param  {number} [toYear]
	 * @param  {string} [order] - "asc" or "desc"
	 * @return {object} example http://data.riksdagen.se/dokumentlista/?avd=dokument&doktyp=bet&a=s&sortorder=desc&sort=datum&utformat=json&sz=50&p=20
	 */
	function queryBills(page, hitsPerPage, fromYear, toYear, order) {
		console.assert(hitsPerPage <= 200, "200 is the maximum allowed hits per page in Riksdagens api");

		order = order || "asc";

		var params = {
			"p": page,
			"avd": "dokument",
			"doktyp": "bet",
			"a": "s",
			"sortorder": order,
			"sort": "datum",
			"utformat": "json",
			"sz": hitsPerPage,
			"from": fromYear ? fromYear + "-01-01" : "",
			"tom": toYear ? toYear + "-12-31" : "",
		};

		var result = HTTP.get(BASE_URL, { params: params });

		return result.data[DOCUMENT_LIST_KEY];
	}

	/**
	 * Get the number of bills currently in Riksdagens database
	 * @param  {number} [year] - get count only for specific year
	 * @return {number}
	 */
	function getBillCount(fromYear, toYear) {
		var data = queryBills(0, 0, fromYear, toYear, fromYear, toYear);
		var count = parseInt(data[COUNT_KEY]);
		return count;
	}

	function getYearLimit(order) {
		var data = queryBills(1, 1, undefined, undefined, order);
		var document = data[DOCUMENT_KEY];
		var date = document[DOCUMENT_DATE_KEY];
		var year = (new Date(date)).getFullYear();
		return year;
	}

	function getYearBegin() {
		return getYearLimit("asc");
	}

	function getYearEnd() {
		return getYearLimit("desc");
	}
});
