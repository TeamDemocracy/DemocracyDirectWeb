(function() {
  'use strict';

  angular
    .module('democracy-direct')
    .component('diBillDetails', {
      templateUrl: 'client/bills/bill-details/bill-details.html',
      controller: BillDetailsController,
      controllerAs: 'vm',
      bindings: {
        
      }
    });

  /* @ngInject */
  function BillDetailsController($scope, $reactive, $stateParams) {
    var vm = this;
    $reactive(vm).attach($scope);

    vm.helpers({
      bill: () => {
        return Bills.findOne({ _id: $stateParams.billId });
      }
    })

    vm.$init = init;

    ////////////////

    function init() {
    }
  }
})();