var request = require("request");
var cheerio = require("cheerio");

module.exports = {
	Betankande: Betankande,
	load: load,
};

function Betankande(ja, nej, avstar, franvarande) {
	this.ja = ja;
	this.nej = nej;
	this.avstar = avstar;
	this.franvarande = franvarande;
}

function load(url, callbackFn) {
	request(url, function(error, response, body) {
		var betankande = parse(body);
		callbackFn(betankande);
	});
}

function parse(html) {
	var $ = cheerio.load(html);

	var ja = parseInt($('.summa_ja').html());
	var nej = parseInt($('.summa_nej').html());
	var avstar = parseInt($('.summa_avstar').html());
	var franvarande = parseInt($('.summa_franvarande').html());

	return new Betankande(ja, nej, avstar, franvarande);
}
