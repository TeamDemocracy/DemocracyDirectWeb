var request = require("request");
var loopback = require("loopback");
var cheerio = require("cheerio");

var Riksdagen = createRiksdagen();

module.exports = {
	getReports: getReports,
}

////////////////

function createRiksdagen() {
	return loopback.createDataSource({
		connector: require("loopback-connector-rest"),
		debug: false,
		operations: [
			{
				template: {
					"method": "GET",
					"url": "http://data.riksdagen.se/dokumentlista/",
					"headers": {
						"accepts": "application/json",
						"content-type": "application/json"
					},
					"query": {
						"a": "s",
						"doktyp": "votering",
						"from": "{from}",
						"tom": "{tom}",
						"utformat": "json",
					},
					"responsePath": "$.dokumentlista.dokument"
				},
				functions: {
					"betankanden": ["from", "tom"]
				}
			}
		]
	});
}

function getReports(fromDate, toDate, callbackFn) {

	// TODO: Handle errors!

	Riksdagen.betankanden(fromDate, toDate, processResponse);

	function processResponse(error, response, body) {
		var documents = response[0];

		var nResolved = 0;

		var reports = [];

		for (var i = 0; i < documents.length; i++) {

			var d = documents[i];

			(function() {

				var report = {
					id: d["id"],
					published: d["publicerad"],
					title: d["undertitel"],
				};

				reports[i] = report;

				var url = d["dokument_url_html"];
				url = encodeURI(url);

				request(url, function(error, response, body) {
					console.assert(!error, error);

					var $ = cheerio.load(body);

					report.yes = $('.summa_ja').html();
					report.no = $('.summa_nej').html();
					report.refraining = $('.summa_avstar').html();
					report.absent = $('.summa_franvarande').html();

					if (++nResolved >= documents.length) {
						// All reports have been resolved
						callbackFn(reports);
					}
				});

			})();
		}
	}
}
