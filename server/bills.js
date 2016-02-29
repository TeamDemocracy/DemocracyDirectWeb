Meteor.publish('bills', function(options) {
	var selector = {
		$and: [
			{"isReady": true},
			{"isReady": {$exists: true}}
		]
	};
	Counts.publish(this, 'numberOfBills', Bills.find(selector), { noReady: true });
	return Bills.find(selector, options);
});