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
    $reactive(vm).attach($scope);

    vm.helpers({
      bills: () => {
        return Bills.find({});
      }
    });

    vm.$init = init;

    ////////////////

    function init() {
    }
  }
})();
