(function() {
	'use strict';

	angular
		.module('democracy-direct')
		.component('diBillVotings', {
			templateUrl: 'client/components/bills/bill-details/bill-votings/bill-voting.html',
			controller: Controller,
			controllerAs: 'VotingCtrl',
			bindings: {
				billvoting: "=",
				advancedvoting: "="
			}
		});

	/* @ngInject */

	Controller.$inject = ['$interval'];

	/* @ngInject */
	function Controller($interval) {
		var vm = this;

		activate()

		function activate() {
			
		}
	}
})();
