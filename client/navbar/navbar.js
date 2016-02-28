(function() {
	'use strict';

	angular
		.module('democracy-direct')
		.component('diNavbar', {
			templateUrl: 'client/navbar/navbar.html',
			controller: NavbarController,
			controllerAs: 'vm',
			bindings: {
			}
		});

	/* @ngInject */
	function NavbarController($scope, $reactive) {
		var vm = this;

		activate();

		////////////////

		function activate() {
			$reactive(vm).attach($scope);
		}
	}
})();