(function() {
	'use strict';

	angular
		.module('democracy-direct')
		.config(config);

	/* @ngInject */
	function config($urlRouterProvider, $stateProvider, $locationProvider) {
		$locationProvider.html5Mode(true);

		$stateProvider
			.state('bills', {
				abstract: true,
				url: '/bills',
				template: '<ui-view></ui-view>'
			})
			.state('bills.list', {
				url: '',
				template: '<di-bills-list></di-bills-list>'
			})
			.state('bills.details', {
				url: '/:billId',
				template: '<di-bill-details></di-bill-details>'
			})
			.state('finances', {
				url: '/finances',
				template: '<p>Platshållare för <strong>Statsfinanser</strong></p>'
			})
			.state('politicians', {
				url: '/politicians',
				template: '<p>Platshållare för <strong>Ledamöter</strong></p>'
			})
			.state('about', {
				url: '/about',
				template: '<p>Platshållare för <strong>Om Sidan</strong></p>'
			})

		$urlRouterProvider.otherwise('/bills');
	}
})();
