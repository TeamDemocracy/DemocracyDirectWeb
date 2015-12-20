// This is just temporary test of loading and parsing betänkanden.
// This will later be done in a cron-job.

var betankande = require("../betankande");

module.exports = function(server) {
	betankande.load("http://data.riksdagen.se/dokument/H319JuU24p7.html", function(betankande) {
		console.log(betankande);
	});
}
