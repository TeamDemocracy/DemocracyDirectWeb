/**
 * Use this to extract nested data from JSON objects
 * @param {object} data - the data extract
 */
DataExtractor = function(data) {
	'use strict';

	console.assert(typeof data === 'object');

	this.extract = extract;
	this.extractList = extractList;
	this.debug = debug;

	////////////////

	function extract(chain) {
		let keys = chain.split('.');
		let layer = data;

		let found = keys.every((key) => {
			if (typeof layer === 'object' && layer !== null) {
				layer = layer[key];
				return true;
			}
			return false;
		});

		return found ? layer : undefined;
	}

	function extractList(chain) {
		let value = extract(chain);
		if (typeof value === 'undefined') {
			return [];
		}
		return Array.isArray(value) ? value : [value];
	}

	function debug() {
		console.log(data);
	}
};
