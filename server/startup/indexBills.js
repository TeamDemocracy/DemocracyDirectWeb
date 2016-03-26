Meteor.startup(function() {

	var FROM_DATE = new Date(2015, 0, 1);

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
			synchronizeNew();
		}
		SyncedCron.add({
			name: 'Check for new bills',
			schedule: function(parser) {
				return parser.text('every 1 minutes');
			},
			job: function() {
				indexNew();
				synchronizeNew();
			}
		});
		SyncedCron.start();
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
		indexPeriod(FROM_DATE, null);
	}


	function indexPeriod(fromDate, toDate) {

		var documentList = new DocumentList("bet", fromDate, toDate);
		var progress = new Progress(documentList.count());

		documentList.forEach(function(document, i) {

			progress.tick(i);

			if (Bills.findOne({ _id: document[ID_KEY] })) return;

			var bill = {
				_id: document[ID_KEY],
				// title: document[TITLE_KEY],
				// summary: document[SUMMARY_KEY],
				date: new Date(document[DATE_KEY]),
				isReady: false,
			};

			Bills.insert(bill);
		});

		progress.done();
	}

	// ===========================
	// ===== Synchronization =====
	// ===========================

	function synchronizeNew() {
		var bills = Bills.find({
			isReady: false,
		}, {
			sort: { date: -1 }
		});
		synchronizeVotings(bills);
	}

	function synchronizeVotings(bills, count) {
		count = count || bills.count();

		var progress = new Progress(count);

		var failCount = 0;

		bills.forEach(function(bill, i) {
			progress.tick(i);
			let id = bill._id;
			let success = synchronizeOne(id);
			failCount += !success;
		});

		progress.done();

		if (failCount > 0) {
			console.warn('Synchronization of', failCount, 'bills failed. Probably because these documents has not been published yet. Trying again later.');
		}
	}

	function synchronizeOne(id) {
		let documentStatus;
		documentStatus = new DocumentStatus(id);

		let isReady = documentStatus.isReady();
		if (!isReady) return false;

		let title = documentStatus.getTitle();
		if (!title) return false;

		let summary = documentStatus.getSummary();
		if (!summary) return false;

		let type = documentStatus.getType();
		if (!type) return false;

		let proposals = documentStatus.getProposals();
		if (!proposals) return false;

		let billUpdate = {
			title: title,
			summary: summary,
			votings: proposals,
			category: type,
			isReady: isReady,
		};
		Bills.update({ _id: id }, { $set: billUpdate });
		return true;
	}
});
