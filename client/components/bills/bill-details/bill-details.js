(function() {
	'use strict';

	angular
		.module('democracy-direct')
		.component('diBillDetails', {
			templateUrl: 'client/components/bills/bill-details/bill-details.html',
			controller: BillDetailsController,
			controllerAs: 'vm',
			bindings: {
			}
		});

	/* @ngInject */
	function BillDetailsController($scope, $reactive, $stateParams) {
		var vm = this;

		activate();

		////////////////

		function activate() {
			$reactive(vm).attach($scope);

			vm.subscribe('bills');

			vm.helpers({
				bill: () => {
					return Bills.findOne({ _id: $stateParams.billId });
				}
			});
		}
	}
})();
