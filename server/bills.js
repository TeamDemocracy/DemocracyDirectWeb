Meteor.publish('bills', function(options) {
	var selector = {};
	Counts.publish(this, 'numberOfBills', Bills.find(selector), { noReady: true });
	return Bills.find(selector, options);
});