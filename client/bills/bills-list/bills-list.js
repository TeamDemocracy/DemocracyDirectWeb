(function() {
	'use strict';

	angular
		.module('democracy-direct')
		.component('diBillsList', {
			templateUrl: 'client/bills/bills-list/bills-list.html',
			controller: BillsListController,
			controllerAs: 'vm',
			bindings: {
			}
		});

	/* @ngInject */
	function BillsListController($scope, $reactive) {
		var vm = this;

		vm.bills = [];
		vm.billCount = 0;
		vm.perPage = 20;
		vm.page = 1;
		vm.sort = {
			date: -1
		};

		vm.pageChanged = pageChanged;

		activate();

		////////////////

		function activate() {
			$reactive(vm).attach($scope);

			vm.subscribe('bills', () => {
				return [
					{
						limit: parseInt(vm.perPage),
						skip: parseInt((vm.getReactively('page') - 1) * vm.perPage),
						sort: vm.sort
					}
				]
			});

			vm.helpers({
				bills: () => {
					return Bills.find({}, { sort: vm.sort });
				},
				billCount: () => {
					return Counts.get('numberOfBills')
				}
			});
		}

		function pageChanged(newPage) {
			this.page = newPage;
		}
	}
})();
