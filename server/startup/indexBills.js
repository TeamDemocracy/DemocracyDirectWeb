Meteor.startup(function() {

	var DATE_KEY = 'datum'; // How to get the date of a document
	var ID_KEY = 'id'; // How to get the id of a document
	var TITLE_KEY = 'notisrubrik'; // How to get the title of a document
	var SUMMARY_KEY = 'notis'; // How to get the summary of a document

	init();

	////////////////

	function init() {
		if (Bills.find().count() < 1) {
			console.log('Bills collection is empty. It will now initialize.');
			console.log('Please allow a couple of minutes for it to finnish.');
			console.log();
			indexAll();
		}
		SyncedCron.add({
			name: 'Check for new bills',
			schedule: function(parser) {
				return parser.text('every 1 minutes');
			},
			job: indexNew
		});
		SyncedCron.start();
		var someBills = Bills.find({}, { skip: 15000, limit: 100 });
		synchronizeCursor(someBills);
	}

	function getLatestLocalBill() {
		return Bills.findOne({}, { sort: { date: -1 } });
	}

	// ====================
	// ===== Indexing =====
	//=====================

	function indexNew() {
		var latestBill = getLatestLocalBill();
		var fromDate = latestBill.date;
		var toDate = null; // No limit
		indexPeriod(fromDate, toDate);
	}

	function indexAll() {
		indexPeriod(null, null);
	}


	function indexPeriod(fromDate, toDate) {

		var documentList = new DocumentList("bet", fromDate, toDate);
		var progress = new Progress(documentList.count());

		documentList.forEach(function(document, i) {

			progress.tick(i);

			if (Bills.findOne({ _id: document[ID_KEY] })) return;

			var bill = {
				_id: document[ID_KEY],
				title: document[TITLE_KEY],
				summary: document[SUMMARY_KEY],
				date: new Date(document[DATE_KEY])
			};

			bill.isReady = !!bill.summary;

			Bills.insert(bill);
		});

		progress.done();
	}

	// ===========================
	// ===== Synchronization =====
	// ===========================

	function synchronizeCursor(cursor) {
		var progress = new Progress(100);

		cursor.forEach(function(bill, i) {
			progress.tick(i);
			var id = bill._id;
			var documentStatus = new DocumentStatus(id);
			documentStatus.synchronizeVotings();
		});

		progress.done();
	}
});
