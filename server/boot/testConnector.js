// This is just temporary test of loading and parsing betänkanden.
// This will later be done in a cron-job.

var connector = require("../connector/sweden.js");

module.exports = function(server) {
	connector.getReports("2015-12-01", "2015-12-02", function(reports) {
		console.log("\n\nLoaded reports between 2015-12-01 and 2015-12-02:\n");
		console.log(reports);
	});
}
